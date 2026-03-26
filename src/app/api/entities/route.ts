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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "newest";
  const category = searchParams.get("category") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 12;
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
      // Silently reject bot submissions (return success to not tip off the bot)
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

    const entity = await prisma.entity.create({
      data: {
        title: sanitizeHtml(data.title),
        description: data.description ? sanitizeHtml(data.description) : null,
        imageUrl: data.imageUrl || null,
        category: data.category,
        tags: data.tags?.length
          ? {
              create: await Promise.all(
                data.tags.map(async (tagName) => {
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

    return NextResponse.json(entity, { status: 201 });
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
