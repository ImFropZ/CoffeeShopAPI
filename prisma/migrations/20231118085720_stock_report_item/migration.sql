/*
  Warnings:

  - You are about to drop the column `stockReportId` on the `StockItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StockItem" DROP CONSTRAINT "StockItem_stockReportId_fkey";

-- AlterTable
ALTER TABLE "StockItem" DROP COLUMN "stockReportId";

-- CreateTable
CREATE TABLE "StockReportItem" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "stockId" TEXT NOT NULL,
    "stockItemId" TEXT NOT NULL,
    "stockReportId" TEXT NOT NULL,

    CONSTRAINT "StockReportItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StockReportItem" ADD CONSTRAINT "StockReportItem_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockReportItem" ADD CONSTRAINT "StockReportItem_stockItemId_fkey" FOREIGN KEY ("stockItemId") REFERENCES "StockItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockReportItem" ADD CONSTRAINT "StockReportItem_stockReportId_fkey" FOREIGN KEY ("stockReportId") REFERENCES "StockReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
