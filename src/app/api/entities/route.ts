import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createEntitySchema } from "@/lib/validators";
import {
  containsToxicContent,
  sanitizeHtml,
  containsSpamLinks,
  isRepeatedContent,
  isHoneypotTriggered,
} from "@/lib/moderation";
import { checkRateLimit } from "@/lib/rate-limit";
import { addPoints, POINTS_CONFIG } from "@/lib/gamification";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "newest";
  const category = searchParams.get("category") || "";
  const contentType = searchParams.get("contentType") || "";
  const tag = searchParams.get("tag") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { hidden: false };

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (category && category !== "all") {
    where.category = category;
  }

  if (contentType && contentType !== "all") {
    where.contentType = contentType;
  }

  if (tag) {
    where.tags = {
      some: {
        tag: { name: tag.toLowerCase() },
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { createdAt: "desc" };
  if (sort === "popular") {
    orderBy = { votes: { _count: "desc" } };
  } else if (sort === "discussed") {
    orderBy = { comments: { _count: "desc" } };
  }

  const [entities, total] = await Promise.all([
    prisma.entity.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        _count: { select: { comments: true, votes: true } },
        votes: { select: { value: true } },
        tags: { include: { tag: true } },
      },
    }),
    prisma.entity.count({ where }),
  ]);

  const result = entities.map((e) => ({
    ...e,
    rating: e.votes.reduce((sum, v) => sum + v.value, 0),
    commentCount: e._count.comments,
    votes: undefined,
    _count: undefined,
  }));

  return NextResponse.json({ entities: result, total, pages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const data = createEntitySchema.parse(body);

    // Honeypot check
    if (isHoneypotTriggered(data.website)) {
      return NextResponse.json({ id: "ok" }, { status: 201 });
    }

    const fullText = `${data.title} ${data.description || ""}`;

    if (
      containsToxicContent(data.title) ||
      (data.description && containsToxicContent(data.description))
    ) {
      return NextResponse.json(
        { error: "Content contains prohibited words." },
        { status: 400 }
      );
    }

    if (containsSpamLinks(fullText)) {
      return NextResponse.json(
        { error: "Content contains spam or too many links." },
        { status: 400 }
      );
    }

    if (isRepeatedContent(data.title)) {
      return NextResponse.json(
        { error: "Title appears to be repetitive or spam." },
        { status: 400 }
      );
    }

    // Auto-add horoscope tags
    let entityTags = data.tags || [];
    if (data.contentType === "horoscope") {
      const horoscopeTags = ["гороскоп", "астрологія", "знакизодіаку"];
      entityTags = [...new Set([...entityTags, ...horoscopeTags])];
    }

    const entity = await prisma.entity.create({
      data: {
        title: sanitizeHtml(data.title),
        description: data.description ? sanitizeHtml(data.description) : null,
        imageUrl: data.imageUrl || null,
        category: data.category,
        contentType: data.contentType || "review",
        zodiacSign: data.zodiacSign || null,
        tags: entityTags.length
          ? {
              create: await Promise.all(
                entityTags.map(async (tagName) => {
                  const tag = await prisma.tag.upsert({
                    where: { name: tagName.toLowerCase().trim() },
                    update: {},
                    create: { name: tagName.toLowerCase().trim() },
                  });
                  return { tagId: tag.id };
                })
              ),
            }
          : undefined,
      },
      include: { tags: { include: { tag: true } } },
    });

    // Gamification: award points for creating a post
    const cookies = request.cookies;
    let userHash = cookies.get("voter_id")?.value;
    if (!userHash) {
      userHash = uuidv4();
    }
    const pointsAmount = data.contentType === "horoscope" ? POINTS_CONFIG.postHoroscope : POINTS_CONFIG.post;
    const pointsResult = await addPoints(userHash, pointsAmount, "post", entity.id);

    const response = NextResponse.json({ ...entity, pointsAwarded: pointsResult.awarded, totalPoints: pointsResult.points, rank: pointsResult.rank }, { status: 201 });
    response.cookies.set("voter_id", userHash, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid form data." },
        { status: 400 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "Server error." },
      { status: 500 }
    );
  }
}
