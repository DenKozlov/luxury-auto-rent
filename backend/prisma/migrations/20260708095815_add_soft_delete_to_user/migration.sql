/*
  Warnings:

  - A unique constraint covering the columns `[email,deletedAt]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_email_key";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_deletedAt_key" ON "user"("email", "deletedAt");
