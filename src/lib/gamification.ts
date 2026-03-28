import prisma from "./prisma";

export const RANKS = {
  novice: { min: 0, max: 49 },
  active: { min: 50, max: 199 },
  expert: { min: 200, max: 499 },
  legend: { min: 500, max: Infinity },
} as const;

export type RankKey = keyof typeof RANKS;

export function getRank(points: number): RankKey {
  if (points >= RANKS.legend.min) return "legend";
  if (points >= RANKS.expert.min) return "expert";
  if (points >= RANKS.active.min) return "active";
  return "novice";
}

export const RANK_COLORS: Record<RankKey, string> = {
  novice: "text-gray-400",
  active: "text-blue-400",
  expert: "text-purple-400",
  legend: "text-yellow-400",
};

export async function getOrCreateUser(userHash: string) {
  return prisma.userActivity.upsert({
    where: { userHash },
    update: {},
    create: { userHash },
    include: { badges: { include: { badge: true } } },
  });
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isYesterday(d1: Date, d2: Date): boolean {
  const yesterday = new Date(d2);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(d1, yesterday);
}

export async function addPoints(
  userHash: string,
  amount: number,
  action: "post" | "comment" | "vote"
) {
  const user = await getOrCreateUser(userHash);
  const now = new Date();
  const lastActive = new Date(user.lastActive);

  let streakBonus = 0;
  let newStreak = user.streak;

  if (!isSameDay(lastActive, now)) {
    if (isYesterday(lastActive, now)) {
      newStreak = user.streak + 1;
      streakBonus = Math.min(newStreak, 5);
    } else {
      newStreak = 1;
    }
  }

  const totalPoints = amount + streakBonus;

  const updateData: Record<string, unknown> = {
    points: { increment: totalPoints },
    streak: newStreak,
    lastActive: now,
  };

  if (action === "post") {
    updateData.postsCount = { increment: 1 };
  } else if (action === "comment") {
    updateData.commentsCount = { increment: 1 };
  } else if (action === "vote") {
    updateData.votesCount = { increment: 1 };
  }

  const updated = await prisma.userActivity.update({
    where: { userHash },
    data: updateData,
    include: { badges: { include: { badge: true } } },
  });

  await checkAndAwardBadges(userHash, updated);

  return { points: updated.points, streak: newStreak, streakBonus, rank: getRank(updated.points) };
}

async function checkAndAwardBadges(
  userHash: string,
  user: { points: number; postsCount: number; commentsCount: number; votesCount: number; streak: number }
) {
  const allBadges = await prisma.badge.findMany();
  const existingBadges = await prisma.userBadge.findMany({
    where: { userHash },
    select: { badgeId: true },
  });
  const existingIds = new Set(existingBadges.map((b) => b.badgeId));

  for (const badge of allBadges) {
    if (existingIds.has(badge.id)) continue;

    let earned = false;
    switch (badge.key) {
      case "first_post":
        earned = user.postsCount >= 1;
        break;
      case "five_posts":
        earned = user.postsCount >= 5;
        break;
      case "ten_comments":
        earned = user.commentsCount >= 10;
        break;
      case "fifty_votes":
        earned = user.votesCount >= 50;
        break;
      case "streak_7":
        earned = user.streak >= 7;
        break;
      case "streak_30":
        earned = user.streak >= 30;
        break;
      case "points_100":
        earned = user.points >= 100;
        break;
      case "points_500":
        earned = user.points >= 500;
        break;
      default:
        earned = user.points >= badge.threshold;
    }

    if (earned) {
      await prisma.userBadge.create({
        data: { userHash, badgeId: badge.id },
      });
    }
  }
}

export const ZODIAC_SIGNS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
] as const;

export type ZodiacSign = (typeof ZODIAC_SIGNS)[number];

export const ZODIAC_ICONS: Record<ZodiacSign, string> = {
  aries: "\u2648",
  taurus: "\u2649",
  gemini: "\u264A",
  cancer: "\u264B",
  leo: "\u264C",
  virgo: "\u264D",
  libra: "\u264E",
  scorpio: "\u264F",
  sagittarius: "\u2650",
  capricorn: "\u2651",
  aquarius: "\u2652",
  pisces: "\u2653",
};
