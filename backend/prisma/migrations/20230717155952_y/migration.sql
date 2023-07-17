/*
  Warnings:

  - You are about to drop the column `ratingId` on the `ListItem` table. All the data in the column will be lost.
  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rating` to the `ListItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ListItem" DROP CONSTRAINT "ListItem_ratingId_fkey";

-- AlterTable
ALTER TABLE "ListItem" DROP COLUMN "ratingId",
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "Rating";
