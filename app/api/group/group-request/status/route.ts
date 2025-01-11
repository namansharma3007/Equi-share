import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    const { groupId, toId, status } = await req.json();
    if (!groupId || !toId || !status) {
      return NextResponse.json(
        { message: "Group ID, to ID and status are required" },
        { status: 400 }
      );
    }

    const groupRequest = await prisma.groupRequest.findFirst({
      where: {
        groupId: groupId,
        toId: toId,
      },
    });
    if (!groupRequest) {
      return NextResponse.json(
        { message: "Group request not found" },
        { status: 404 }
      );
    }

    const updatedGroup = await prisma.$transaction(async (prisma) => {
      let group;
      if (status === "ACCEPTED") {
        group = await prisma.group.update({
          where: { id: groupId },
          data: {
            members: {
              connect: { id: toId },
            },
          },
          select: {
            id: true,
            name: true,
            description: true,
            groupAdminId: true,
            members: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                gender: true,
              },
            },
          },
        });
      }

      await prisma.groupRequest.deleteMany({
        where: { groupId, toId },
      });

      return { group };
    });

    return NextResponse.json(
      {
        message: "Group request status updated successfully",
        updatedGroup,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating group request status:", error);
    return NextResponse.json(
      { message: "Internal server Error" },
      { status: 500 }
    );
  }
}
