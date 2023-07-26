/*
  Warnings:

  - You are about to drop the column `userId` on the `ListComment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ListItemComment` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `ListComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `ListItemComment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ListComment" DROP CONSTRAINT "ListComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "ListItemComment" DROP CONSTRAINT "ListItemComment_userId_fkey";

-- AlterTable
ALTER TABLE "ListComment" DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ListItemComment" DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ListComment" ADD CONSTRAINT "ListComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListItemComment" ADD CONSTRAINT "ListItemComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
