-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "gender" "Gender" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friend" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FriendRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "groupId" TEXT NOT NULL,
    "paidByUser" TEXT NOT NULL,
    "cleared" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Split" (
    "id" TEXT NOT NULL,
    "amountOwed" DECIMAL(65,30) NOT NULL,
    "expenseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "cleared" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Split_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GroupsPartOf" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Friend_userId_idx" ON "Friend"("userId");

-- CreateIndex
CREATE INDEX "Friend_friendId_idx" ON "Friend"("friendId");

-- CreateIndex
CREATE UNIQUE INDEX "Friend_userId_friendId_key" ON "Friend"("userId", "friendId");

-- CreateIndex
CREATE INDEX "FriendRequest_fromId_idx" ON "FriendRequest"("fromId");

-- CreateIndex
CREATE INDEX "FriendRequest_toId_idx" ON "FriendRequest"("toId");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_fromId_toId_key" ON "FriendRequest"("fromId", "toId");

-- CreateIndex
CREATE INDEX "Expense_groupId_idx" ON "Expense"("groupId");

-- CreateIndex
CREATE INDEX "Expense_paidByUser_idx" ON "Expense"("paidByUser");

-- CreateIndex
CREATE UNIQUE INDEX "Expense_groupId_id_key" ON "Expense"("groupId", "id");

-- CreateIndex
CREATE INDEX "Split_expenseId_idx" ON "Split"("expenseId");

-- CreateIndex
CREATE INDEX "Split_userId_idx" ON "Split"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Split_expenseId_userId_key" ON "Split"("expenseId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupsPartOf_AB_unique" ON "_GroupsPartOf"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupsPartOf_B_index" ON "_GroupsPartOf"("B");

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_toId_fkey" FOREIGN KEY ("toId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_paidByUser_fkey" FOREIGN KEY ("paidByUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Split" ADD CONSTRAINT "Split_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Split" ADD CONSTRAINT "Split_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Split" ADD CONSTRAINT "Split_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupsPartOf" ADD CONSTRAINT "_GroupsPartOf_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupsPartOf" ADD CONSTRAINT "_GroupsPartOf_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

