import { stockItemSchema, updateStockItemSchema } from "../schema";
import * as z from "zod";
import { BadRequestError } from "../models/error";
import { prisma } from "../config/prisma";

class StockService {
  prisma = prisma;

  StockService() {}

  async getStocks() {
    return await this.prisma.stock.findMany({ include: { items: true } });
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

    const items = await this.prisma.stockItem.findMany({
      where: {
        id: {
          in: stockItems.map((stockItem) => stockItem.id),
        },
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

      const fromQty = items.find(
        (item: { id: string }) => item.id === stockItem.id
      )?.quantity;

      if (fromQty === undefined)
        throw new BadRequestError("Unable to find the stock id");

      // Add to stock report
      await this.prisma.stockReportItem.create({
        data: {
          quantity: item.quantity - fromQty,
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

  async removeStockItem(stockId: string, itemId: string) {
    return await this.prisma.stockItem.delete({
      where: {
        id: itemId,
        stockId: stockId,
      },
    });
  }

  async getStockReport(id: string) {
    return await this.prisma.stock.findMany({
      where: {
        id: id,
      },
      include: {
        stockReportItems: true,
      },
    });
  }

  async getStockReports() {
    return await this.prisma.stockReport.findMany({
      include: { stockReportItems: { include: { stock: true } } },
    });
  }
}

export default new StockService();
