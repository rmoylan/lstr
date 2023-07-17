/*
  Warnings:

  - A unique constraint covering the columns `[memberNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "memberNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_memberNumber_key" ON "User"("memberNumber");
