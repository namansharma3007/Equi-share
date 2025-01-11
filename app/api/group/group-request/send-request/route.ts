import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("userId");

    const { groupId, toId } = await req.json();

    if (!groupId || !toId) {
      return NextResponse.json(
        { message: "Group ID and to ID are required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const group = await prisma.group.findFirst({
      where: { id: groupId },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const toUser = await prisma.user.findFirst({
      where: { id: toId },
    });

    if (!toUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const user = await prisma.user.findFirst({
      where: {
        AND: [{ id: userId }, { group: { some: { id: groupId } } }],
      },
    });
    if (!user) {
      return NextResponse.json(
        { message: "You are not part of this group" },
        { status: 400 }
      );
    }
    const preRequest = await prisma.groupRequest.findFirst({
      where: { groupId: groupId, toId: toId },
    });

    if (preRequest) {
      return NextResponse.json(
        { message: "Request already sent" },
        { status: 400 }
      );
    }

    const groupRequest = await prisma.groupRequest.create({
      data: {
        groupId: groupId,
        toId: toId,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { message: "Group request sent successfully", groupRequest },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error sending group request:", error);
    return NextResponse.json(
      { message: "Internal server Error" },
      { status: 500 }
    );
  }
}
