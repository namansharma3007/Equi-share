import { NextResponse, NextRequest } from "next/server";
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

    const group = await prisma.group.findFirst({
      where: { id: groupId },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
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

    const groupRequests = await prisma.groupRequest.findMany({
      where: {
        groupId: groupId,
        status: "PENDING",
      },
    });

    return NextResponse.json(groupRequests, { status: 200 });
  } catch (error) {
    console.log("Error fetching group requests:", error);
    return NextResponse.json(
      { message: "Internal server Error" },
      { status: 500 }
    );
  }
}
