import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
): Promise<NextResponse> {
  try {
    const userId = req.headers.get("userId");

    const resolvedParams = await params;
    const { groupId } = resolvedParams;

    if (!groupId) {
      return NextResponse.json(
        { message: "Group id is required" },
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
        { message: "You are not part of this group" },
        { status: 400 }
      );
    }

    const groupMembers = await prisma.group.findFirst({
      where: { id: groupId },
      select: {
        members: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            gender: true,
            image: true,
          },
        },
      },
    });

    if (!groupMembers) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json(groupMembers, { status: 200 });
  } catch (error) {
    console.log("Error occured while fetching group members", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
