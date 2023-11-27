import { PrismaClient } from "@prisma/client";
import { BadRequestError } from "../models/error";
import { Moment } from "moment";

class InvoiceService {
  prisma = new PrismaClient();

  async getInvoices(dateRange: { start: Moment; end: Moment } | undefined) {
    if (!dateRange) {
      return await this.prisma.invoice.findMany({
        include: { items: true },
      });
    }

    const { start, end } = dateRange;

    return await this.prisma.invoice.findMany({
      where: {
        createdAt: {
          lte: end.toISOString(),
          gte: start.toISOString(),
        },
      },
      include: { items: true },
    });
  }

  async deleteInvoice(id: string) {
    return await this.prisma.invoice
      .delete({
        where: { id },
      })
      .catch(() => {
        throw new BadRequestError("Invoice not found");
      });
  }
}

export default new InvoiceService();
