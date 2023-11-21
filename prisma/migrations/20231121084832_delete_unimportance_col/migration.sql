/*
  Warnings:

  - You are about to drop the column `cupSize` on the `InvoiceItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `PasswordReset` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "InvoiceItem" DROP COLUMN "cupSize";

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_userId_key" ON "PasswordReset"("userId");
