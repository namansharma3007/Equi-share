import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const userId = req.headers.get("userId");

    const resolvedParams = await params;
    const { groupId } = resolvedParams;
    if (!groupId) {
      return NextResponse.json(
        { message: "Group ID is required" },
        { status: 400 }
      );
    }
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        AND: [{ id: userId }, { group: { some: { id: groupId } } }],
      },
    });
    if (!user) {
      return NextResponse.json(
        { error: "You are not part of this group" },
        { status: 400 }
      );
    }
    const group = await prisma.group.findFirst({
      where: { id: groupId },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        groupAdminId: true,
        groupAdmin: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        members: {
          select: {
            id: true,
            name: true,
            username: true,
            gender: true,
          },
        },
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json(group, { status: 200 });
  } catch (error) {
    console.log("Error fetching group:", error);
    return NextResponse.json(
      { error: "Internal server Error" },
      { status: 500 }
    );
  }
}
