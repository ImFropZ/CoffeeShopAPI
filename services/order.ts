import * as z from "zod";
import { orderSchema } from "../schema";
import { BadRequestError } from "../models/error";
import { prisma } from "../config/prisma";

type OrderParams = {
  username: string;
} & z.infer<typeof orderSchema>;

class OrderService {
  prisma = prisma;

  OrderService() {}

  async order(order: OrderParams) {
    const { username, menus, discount, customerId } = order;

    if (customerId) {
      const customer = await this.prisma.customer.findUnique({
        where: {
          id: customerId,
        },
      });

      if (!customer) {
        throw new BadRequestError("Customer not found");
      }
    }

    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        id: {
          in: menus.map((menu) => menu.id),
        },
      },
    });

    let subTotal = 0.0;
    menuItems.forEach((item) => {
      const foundMenu = menus.find((m) => m.id === item.id);
      if (foundMenu) {
        // @ts-ignore
        foundMenu.price = item.price;
        subTotal += foundMenu.quantity * Number(item.price);
      }
    });

    const invoice = await this.prisma.invoice
      .create({
        data: {
          discount: discount,
          ...(customerId && { customer: { connect: { id: customerId } } }),
          user: { connect: { username: username } },
          subTotal: parseFloat(subTotal.toFixed(2)),
          total: parseFloat((subTotal * (1 - discount)).toFixed(2)),
          items: {
            createMany: {
              data: menus.map((menu) => ({
                quantity: menu.quantity,
                sugar: menu.sugar,
                // @ts-ignore
                price: menu.price,
                ice: menu.ice,
                attributes: menu.attributes,
                menuId: menu.id,
              })),
            },
          },
        },
      })
      .catch((_) => {
        console.log(_);
        throw new BadRequestError(
          "Unable to order the items at the moment. Please try again later"
        );
      });

    return !!invoice;
  }
}

export default new OrderService();
