import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const cookies = request.cookies;
  const userHash = cookies.get("voter_id")?.value;

  if (!userHash) {
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }

  const notifications = await prisma.notification.findMany({
    where: { userHash },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      entity: { select: { id: true, title: true } },
    },
  });

  const unreadCount = await prisma.notification.count({
    where: { userHash, read: false },
  });

  return NextResponse.json({ notifications, unreadCount });
}

export async function POST(request: NextRequest) {
  const cookies = request.cookies;
  const userHash = cookies.get("voter_id")?.value;

  if (!userHash) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, notificationId } = body;

    if (action === "markRead" && notificationId) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
      });
    } else if (action === "markAllRead") {
      await prisma.notification.updateMany({
        where: { userHash, read: false },
        data: { read: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
