import { NextRequest, NextResponse } from "next/server";
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

    const group = await prisma.group.findFirst({
      where: { id: groupId },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const groupPartOf = await prisma.user.findFirst({
      where: { AND: [{ id: userId }, { group: { some: { id: groupId } } }] },
    });

    if (!groupPartOf) {
      return NextResponse.json(
        { message: "You are not part of this group" },
        { status: 400 }
      );
    }

    const groupExpense = await prisma.expense.findMany({
      where: {
        groupId: groupId,
      },
      include: {
        payerUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            gender: true,
            image: true,
          },
        },
        splits: {
          include: {
            user: {
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
        },
      },
    });

    return NextResponse.json(
      { message: "Expenses fetched successfully", expenses: groupExpense },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching group expenses:", error);
    return NextResponse.json(
      { message: "Internal server Error" },
      { status: 500 }
    );
  }
}
