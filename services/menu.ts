import { PrismaClient } from "@prisma/client";
import * as z from "zod";
import { createMenuSchema, updateMenuSchema } from "../schema";
import { BadRequestError } from "../models/error";

class MenuService {
  prisma = new PrismaClient();

  MenuService() {}

  async menus() {
    const menus = await this.prisma.menu.findMany({
      where: { isActive: true },
    });
    return menus;
  }

  async createMenu({
    name,
    picture,
    cupSize,
    price,
  }: z.infer<typeof createMenuSchema>) {
    const menu = await this.prisma.menu
      .create({
        data: {
          name,
          picture,
          price,
          cupSize,
        },
      })
      .catch(() => {
        throw new BadRequestError("The menu is already exist");
      });
    return {
      id: menu.id,
      name: menu.name,
      picture: menu.picture,
      price: menu.price,
      cupSize: menu.cupSize,
    };
  }

  async updateMenu({
    id,
    name,
    picture,
    price,
    cupSize,
  }: z.infer<typeof updateMenuSchema>) {
    const updatedMenu = await this.prisma.menu
      .update({
        where: { id },
        data: { name, picture, price, cupSize },
      })
      .catch(() => {
        throw new BadRequestError("The menu detail is already exist");
      });

    return {
      id: updatedMenu.id,
      name: updatedMenu.name,
      picture: updatedMenu.picture,
      price: updatedMenu.price,
      cupSize: updatedMenu.cupSize,
    };
  }
}

export default new MenuService();
