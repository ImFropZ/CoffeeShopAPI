import { PrismaClient } from "@prisma/client";
import { stockItemSchema, updateStockItemSchema } from "../schema";
import * as z from "zod";

class StockService {
  prisma = new PrismaClient();

  StockService() {}

  async getStocks() {
    return await this.prisma.stock.findMany();
  }

  async getStock(id: string) {
    return await this.prisma.stock.findUnique({
      where: {
        id: id,
      },
    });
  }

  async createStock(stock: any) {
    return await this.prisma.stock.create({
      data: stock,
    });
  }

  async updateStock(id: string, stock: any) {
    return await this.prisma.stock.update({
      where: {
        id: id,
      },
      data: stock,
    });
  }

  async removeStock(id: string) {
    return await this.prisma.stock.delete({
      where: {
        id: id,
      },
    });
  }

  async getStockItems(id: string) {
    return await this.prisma.stockItem.findMany({
      where: {
        stockId: id,
      },
    });
  }

  async getStockItem(id: string) {
    return await this.prisma.stockItem.findUnique({
      where: {
        id: id,
      },
    });
  }

  async createStockItem(stockItem: any) {
    return await this.prisma.stockItem.create({
      data: stockItem,
    });
  }

  async updateStockItem(stockItems: z.infer<typeof updateStockItemSchema>) {
    const stockReport = await this.prisma.stockReport.create({
      data: {
        createdAt: new Date(),
      },
    });

    // Loop through the array of stock items and update each item
    for (const stockItem of stockItems) {
      const item = await this.prisma.stockItem.update({
        where: {
          id: stockItem.id,
        },
        data: {
          quantity: stockItem.quantity,
        },
      });

      // Add to stock report
      await this.prisma.stockReportItem.create({
        data: {
          quantity: stockItem.quantity,
          stockItemId: stockItem.id,
          stockId: item.stockId,
          stockReportId: stockReport.id,
        },
      });
    }

    return await this.prisma.stockItem.findMany({
      where: {
        id: {
          in: stockItems.map((stockItem) => stockItem.id),
        },
      },
    });
  }

  async addStockItem(id: string, stockItem: z.infer<typeof stockItemSchema>) {
    return await this.prisma.stockItem.create({
      data: {
        ...stockItem,
        stockId: id,
      },
    });
  }

  async removeStockItem(id: string) {
    return await this.prisma.stockItem.delete({
      where: {
        id: id,
      },
    });
  }

  async getStockReport(id: string) {
    return await this.prisma.stock.findMany({
      where: {
        id: id,
      },
      include: {
        stockItems: true,
      },
    });
  }

  async getStockReports() {
    return await this.prisma.stockReport.findMany();
  }
}

export default new StockService();
