/*
  Warnings:

  - Added the required column `expenseCreatorId` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "expenseCreatorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_expenseCreatorId_fkey" FOREIGN KEY ("expenseCreatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
