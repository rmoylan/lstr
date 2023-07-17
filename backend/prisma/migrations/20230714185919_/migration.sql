/*
  Warnings:

  - You are about to drop the column `scaleId` on the `List` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "List" DROP CONSTRAINT "List_scaleId_fkey";

-- AlterTable
ALTER TABLE "List" DROP COLUMN "scaleId";
