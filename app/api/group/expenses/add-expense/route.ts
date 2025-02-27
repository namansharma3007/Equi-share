import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("userId");
    const { name, amount, groupId, paidByUser, splits } = await req.json();

    if (
      !userId ||
      !name ||
      !amount ||
      !groupId ||
      !paidByUser ||
      !splits ||
      splits.length === 0
    ) {
      return NextResponse.json(
        { message: "Parameters missing for creating expense" },
        { status: 400 }
      );
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    const totalSplitAmount = splits.reduce(
      (
        sum: number,
        split: { id: string; amount: number | null; }
      ) => sum + (split.amount ?? 0)
    , 0);
    
    if (!isClose(totalSplitAmount, amount, 0.01)) {
      return NextResponse.json(
        { message: "Total splits amount does not match expense amount" },
        { status: 400 }
      );
    }
    

    const newExpense = await prisma.$transaction(async (prisma) => {
      let clearingStatus = splits.length === 1 && splits[0].id === paidByUser;
      const expense = await prisma.expense.create({
        data: {
          name,
          amount,
          groupId,
          paidByUser,
          expenseCreatorId: userId,
          cleared: clearingStatus,
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
        },
      });
    
      const splitData = splits.map(
        (split: { id: string; amount: number; name: string }) => ({
          amountOwed: split.amount,
          expenseId: expense.id,
          userId: split.id,
          groupId,
          cleared: paidByUser === split.id,
        })
      );
    
      await prisma.split.createMany({
        data: splitData,
      });
    
      const expenseWithSplits = await prisma.expense.findUnique({
        where: { id: expense.id },
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
    
      return expenseWithSplits;
    });

    return NextResponse.json(
      { message: "Expense added successfully", newExpense },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while creating expense: ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

function isClose(a: number, b: number, tolerance: number): boolean {
  const result = b - a;
  const roundedResult = parseFloat(result.toFixed(2));
  return Math.abs(roundedResult) <= tolerance;
}