import { PrismaClient } from "@prisma/client";
import * as z from "zod";
import { createCustomerSchema, updateCustomerSchema } from "../schema";
import { BadRequestError } from "../models/error";

class CustomerService {
  prisma = new PrismaClient();

  CustomerService() {}

  async getCustomers() {
    return this.prisma.customer.findMany();
  }

  async getCustomer(id: string) {
    return this.prisma.customer.findUnique({
      where: { id },
    });
  }

  async getCustomerOrders(id: string) {
    return this.prisma.invoice.findMany({
      where: { customerId: id },
    });
  }

  async createCustomer(customer: z.infer<typeof createCustomerSchema>) {
    return this.prisma.customer.create({
      data: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
      },
    });
  }

  async updateCustomer(
    id: string,
    customer: z.infer<typeof updateCustomerSchema>
  ) {
    const { name, phone, address } = customer;

    return this.prisma.customer
      .update({
        where: { id },
        data: {
          ...(name ? { name } : {}),
          ...(phone ? { phone } : {}),
          ...(address ? { address } : {}),
        },
      })
      .catch(() => {
        throw new BadRequestError("User not found");
      });
  }
}

export default new CustomerService();
