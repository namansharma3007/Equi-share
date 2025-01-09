/*
  Warnings:

  - Added the required column `groupAdminId` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "groupAdminId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_groupAdminId_fkey" FOREIGN KEY ("groupAdminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
