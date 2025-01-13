import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.headers.get("userId");

    const { groupId } = await req.json();
    if (!groupId || !userId) {
      return NextResponse.json(
        { message: "Group ID and user id is required" },
        { status: 400 }
      );
    }

    const group = await prisma.group.findFirst({
      where: { id: groupId },
    });
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    if (group.groupAdminId !== userId) {
      return NextResponse.json(
        { message: "Only group admin can delete a group" },
        { status: 400 }
      );
    }

    await prisma.group.delete({
      where: {
        id: groupId,
      },
    });

    return NextResponse.json(
      { message: "Group deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting group:", error);
    return NextResponse.json(
      { message: "Internal server Error" },
      { status: 500 }
    );
  }
}
