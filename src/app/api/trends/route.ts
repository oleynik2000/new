import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Popular today (most votes in last 24h)
  const popularToday = await prisma.entity.findMany({
    where: {
      hidden: false,
      createdAt: { gte: oneDayAgo },
    },
    orderBy: { votes: { _count: "desc" } },
    take: 5,
    include: {
      votes: { select: { value: true } },
      tags: { include: { tag: true } },
      _count: { select: { comments: true } },
    },
  });

  // Most discussed this week
  const mostDiscussed = await prisma.entity.findMany({
    where: {
      hidden: false,
      createdAt: { gte: oneWeekAgo },
    },
    orderBy: { comments: { _count: "desc" } },
    take: 5,
    include: {
      votes: { select: { value: true } },
      tags: { include: { tag: true } },
      _count: { select: { comments: true } },
    },
  });

  // Trending tags (most used in last week)
  const recentTags = await prisma.tagOnEntity.findMany({
    where: {
      entity: {
        createdAt: { gte: oneWeekAgo },
        hidden: false,
      },
    },
    include: { tag: true },
  });

  const tagCounts: Record<string, { name: string; count: number }> = {};
  for (const te of recentTags) {
    if (!tagCounts[te.tag.name]) {
      tagCounts[te.tag.name] = { name: te.tag.name, count: 0 };
    }
    tagCounts[te.tag.name].count++;
  }
  const trendingTags = Object.values(tagCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // New today count
  const newTodayCount = await prisma.entity.count({
    where: {
      hidden: false,
      createdAt: { gte: oneDayAgo },
    },
  });

  const format = (entities: typeof popularToday) =>
    entities.map((e) => ({
      id: e.id,
      title: e.title,
      category: e.category,
      contentType: e.contentType,
      zodiacSign: e.zodiacSign,
      rating: e.votes.reduce((sum, v) => sum + v.value, 0),
      commentCount: e._count.comments,
      createdAt: e.createdAt,
      tags: e.tags,
    }));

  return NextResponse.json({
    popularToday: format(popularToday),
    mostDiscussed: format(mostDiscussed),
    trendingTags,
    newTodayCount,
  });
}
