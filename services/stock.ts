import { PrismaClient } from "@prisma/client";

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

  async updateStockItem(id: string, stockItem: any) {
    return await this.prisma.stockItem.update({
      where: {
        id: id,
      },
      data: stockItem,
    });
  }

  async removeStockItem(id: string) {
    return await this.prisma.stockItem.delete({
      where: {
        id: id,
      },
    });
  }
}

export default new StockService();
