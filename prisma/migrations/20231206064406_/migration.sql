/*
  Warnings:

  - You are about to drop the column `cupSize` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Menu` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,drinkType]` on the table `Menu` will be added. If there are existing duplicate values, this will fail.
  - Made the column `invoiceId` on table `InvoiceItem` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `categories` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `drinkType` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DrinkType" AS ENUM ('HOT', 'COLD', 'FRAPPE');

-- DropForeignKey
ALTER TABLE "InvoiceItem" DROP CONSTRAINT "InvoiceItem_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceItem" DROP CONSTRAINT "InvoiceItem_menuId_fkey";

-- DropIndex
DROP INDEX "Menu_name_cupSize_key";

-- AlterTable
ALTER TABLE "InvoiceItem" ALTER COLUMN "invoiceId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "cupSize",
DROP COLUMN "isActive",
DROP COLUMN "picture",
DROP COLUMN "price",
ADD COLUMN     "categories" TEXT NOT NULL,
ADD COLUMN     "drinkType" "DrinkType" NOT NULL;

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "cupSize" "CupSize" NOT NULL,
    "picture" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_menuId_cupSize_key" ON "MenuItem"("menuId", "cupSize");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_name_drinkType_key" ON "Menu"("name", "drinkType");

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
