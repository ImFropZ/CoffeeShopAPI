/*
  Warnings:

  - A unique constraint covering the columns `[name,cupSize]` on the table `Menu` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cupSize` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "cupSize" "CupSize" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Menu_name_cupSize_key" ON "Menu"("name", "cupSize");
