import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
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
    const groupPartOf = await prisma.user.findFirst({
      where: { AND: [{ id: userId }, { group: { some: { id: groupId } } }] },
    });

    if (!groupPartOf) {
      return NextResponse.json(
        { error: "You are not part of this group" },
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
            name: true,
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
                name: true,
                username: true,
                gender: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({message: "Expenses fetched successfully", expenses: groupExpense}, { status: 200 });
  } catch (error) {
    console.log("Error fetching group expenses:", error);
    return NextResponse.json(
      { error: "Internal server Error" },
      { status: 500 }
    );
  }
}
