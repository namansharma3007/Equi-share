import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("userId");

    const { splitId, expenseId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "Parameters missing! User not found" },
        { status: 400 }
      );
    }

    if (!splitId || !expenseId) {
      return NextResponse.json(
        { message: "Parameters missing" },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!expense) {
      return NextResponse.json(
        { message: "Expense not found" },
        { status: 404 }
      );
    }

    if (expense.paidByUser !== userId) {
      return NextResponse.json(
        { message: "Only the payer can clear the split" },
        { status: 403 }
      );
    }

    const split = await prisma.$transaction(async (prisma) => {
      const split = await prisma.split.update({
        where: { id: splitId },
        data: { cleared: true },
      });
      const checkSplitsStatus = await prisma.expense.findFirst({
        where: {
          AND: [
            { id: expenseId },
            { splits: { some: { cleared: false } } }
          ]
        }
      });
      let cleared = false;
      if(!checkSplitsStatus) {
        await prisma.expense.update({ where: { id: expenseId }, data: { cleared: true } });
        cleared = true;
      }

      return {split, cleared};
    })



    return NextResponse.json(
      { message: "Split cleared successfully", split: split },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while clearing split: ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
