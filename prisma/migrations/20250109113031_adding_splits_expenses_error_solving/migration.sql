-- AlterTable
ALTER TABLE "_GroupsPartOf" ADD CONSTRAINT "_GroupsPartOf_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_GroupsPartOf_AB_unique";
