-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_groupAdminId_fkey";

-- CreateTable
CREATE TABLE "GroupRequest" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GroupRequest_groupId_idx" ON "GroupRequest"("groupId");

-- CreateIndex
CREATE INDEX "GroupRequest_toId_idx" ON "GroupRequest"("toId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupRequest_groupId_toId_key" ON "GroupRequest"("groupId", "toId");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_groupAdminId_fkey" FOREIGN KEY ("groupAdminId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupRequest" ADD CONSTRAINT "GroupRequest_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupRequest" ADD CONSTRAINT "GroupRequest_toId_fkey" FOREIGN KEY ("toId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
