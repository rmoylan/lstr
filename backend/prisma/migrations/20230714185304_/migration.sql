/*
  Warnings:

  - You are about to drop the column `settingId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Vote` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_settingId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_authorId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "settingId";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "authorId";
