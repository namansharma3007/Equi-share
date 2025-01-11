import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("userId");

    const { groupName, groupDescription } = await req.json();

    if (!userId || !groupName) {
      return NextResponse.json(
        { message: "Parameters missing for this creating group" },
        { status: 400 }
      );
    }

    if (groupName.length < 1 || groupName.length > 25) {
      return NextResponse.json(
        {
          error:
            "Group name must be at least 1 character and at max 25 characters",
        },
        { status: 400 }
      );
    }

    if (groupDescription.length < 5 || groupDescription.length > 80) {
      return NextResponse.json(
        {
          error:
            "Group description must be at least 5 characters and at max 80 characters",
        },
        { status: 400 }
      );
    }

    const newGroup = await prisma.$transaction(async (prisma) => {
      const group = await prisma.group.create({
        data: {
          name: groupName,
          description: groupDescription,
          groupAdminId: userId,
          members: {
            connect: { id: userId },
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          groupAdminId: true,
          members: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              gender: true,
              image: true,
              createdAt: true,
            },
          },
        },
      });

      return { group };
    });

    return NextResponse.json(
      { message: "Group created successfully", newGroup: newGroup.group },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while creating group: ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
