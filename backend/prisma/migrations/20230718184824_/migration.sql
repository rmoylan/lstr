/*
  Warnings:

  - Added the required column `scaleId` to the `List` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "List" ADD COLUMN     "privacy" "Privacy" NOT NULL DEFAULT E'PRIVATE',
ADD COLUMN     "scaleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Scale" ALTER COLUMN "type" SET DEFAULT E'PRECISE';

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_scaleId_fkey" FOREIGN KEY ("scaleId") REFERENCES "Scale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
