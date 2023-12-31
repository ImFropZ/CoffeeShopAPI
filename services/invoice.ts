import { BadRequestError } from "../models/error";
import { Moment } from "moment";
import { prisma } from "../config/prisma";

class InvoiceService {
  prisma = prisma;

  async getInvoices(dateRange: { start: Moment; end: Moment } | undefined) {
    if (!dateRange) {
      return await this.prisma.invoice.findMany({
        include: {
          items: {
            include: {
              menuItem: {
                include: {
                  menu: true,
                },
              },
            },
          },
          customer: true,
          user: true,
        },
      });
    }

    const { start, end } = dateRange;

    // Set the end to the end of the day
    end.set({ hour: 23, minute: 59, second: 59 });

    return await this.prisma.invoice.findMany({
      where: {
        createdAt: {
          lte: end.toISOString(),
          gte: start.toISOString(),
        },
      },
      include: {
        items: {
          include: {
            menuItem: {
              include: {
                menu: true,
              },
            },
          },
        },
        customer: true,
        user: true,
      },
    });
  }

  async deleteInvoice(id: string) {
    try {
      await this.prisma.invoiceItem.deleteMany({
        where: {
          invoiceId: id,
        },
      });
      return await this.prisma.invoice.delete({
        where: { id },
      });
    } catch (_) {
      throw new BadRequestError("Invoice not found");
    }
  }
}

export default new InvoiceService();
