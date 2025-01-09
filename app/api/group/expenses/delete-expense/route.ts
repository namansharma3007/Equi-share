import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.headers.get("userId");

    const { expenseId } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Parameters missing! User not found" }, { status: 400 });
    }

    if (!expenseId) {
      return NextResponse.json({ message: "Parameters missing" }, { status: 400 });
    }

    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!expense) {
      return NextResponse.json({ message: "Expense not found" }, { status: 404 });
    }

    if (expense.paidByUser !== userId && expense.expenseCreatorId !== userId) {
      return NextResponse.json({ message: "Only the payer or creator can delete the expense" }, { status: 403 });
    }

    await prisma.expense.delete({
      where: { id: expenseId },
    });

    return NextResponse.json({ message: "Expense deleted successfully", expenseId: expense.id }, { status: 200 });

  } catch (error) {
    console.log("Error while deleting expense: ", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
