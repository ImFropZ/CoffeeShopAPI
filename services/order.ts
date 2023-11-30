import { PrismaClient } from "@prisma/client";
import * as z from "zod";
import { orderSchema } from "../schema";
import { BadRequestError } from "../models/error";

type OrderParams = {
  username: string;
} & z.infer<typeof orderSchema>;

class OrderService {
  prisma = new PrismaClient();

  OrderService() {}

  async order(order: OrderParams) {
    const { username, menus, customerId } = order;

    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new BadRequestError("Invalid user data");
    }

    const menuItems = (
      await this.prisma.menu.findMany({
        where: {
          id: {
            in: menus.map((menu) => menu.id),
          },
        },
      })
    ).map((item: { id: string; price: any }) => {
      return {
        menuId: item.id,
        quantity: menus.find((menu) => menu.id === item.id)?.quantity || 1,
        sugar: menus.find((menu) => menu.id === item.id)?.sugar || 1,
        attribute: menus.find((menu) => menu.id === item.id)?.attribute || "",
        ice: menus.find((menu) => menu.id === item.id)?.ice || 1,
        price: item.price,
      };
    });

    if (menuItems.length === 0 && menuItems.length !== menus.length) {
      throw new BadRequestError("Invalid menu data");
    }

    const invoice = await this.prisma.invoice
      .create({
        data: {
          createdAt: new Date(),
          customer: customerId ? { connect: { id: customerId } } : undefined,
          user: { connect: { id: user.id } },
          items: {
            createMany: {
              data: menuItems,
            },
          },
        },
      })
      .catch(() => {
        throw new BadRequestError(
          "Unable to order the items at the moment. Please try again later"
        );
      });

    return !!invoice;
  }
}

export default new OrderService();
