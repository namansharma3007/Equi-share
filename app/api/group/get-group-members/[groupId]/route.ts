import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { decodeToken } from "@/lib/auth";
import { JwtPayload } from "jsonwebtoken";

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
        { error: "You are not part of this group" },
        { status: 400 }
      );
    }
    const groupMembers = await prisma.group.findFirst({
      where: { id: groupId },
      select: {
        members: {
          select: {
            id: true,
            name: true,
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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}