import * as z from "zod";
import {
  createMenuSchema,
  updateMenuItemSchema,
  updateMenuSchema,
} from "../schema";
import { BadRequestError } from "../models/error";
import { prisma } from "../config/prisma";

class MenuService {
  prisma = prisma;

  MenuService() {}

  async menus() {
    const menus = await this.prisma.menu.findMany({
      include: {
        menuItems: true,
      },
    });
    return menus;
  }

  async createMenu({
    name,
    drinkType,
    categories,
  }: z.infer<typeof createMenuSchema>) {
    const menu = await this.prisma.menu
      .create({
        data: {
          name,
          drinkType,
          categories: categories
            .split(",")
            .map((category) => category.trim().toLowerCase())
            .filter((category) => category !== "")
            .join(","),
          menuItems: {
            create: [
              {
                cupSize: "SMALL",
                price: 0,
                picture: "",
                isActive: false,
              },
              {
                cupSize: "MEDIUM",
                price: 0,
                picture: "",
                isActive: false,
              },
              {
                cupSize: "LARGE",
                price: 0,
                picture: "",
                isActive: false,
              },
            ],
          },
        },
        include: { menuItems: true },
      })
      .catch(() => {
        throw new BadRequestError("The menu is already exist");
      });

    return menu;
  }

  async updateMenu({
    id,
    name,
    drinkType,
    categories,
  }: z.infer<typeof updateMenuSchema> & { id: string }) {
    const updatedMenu = await this.prisma.menu
      .update({
        where: { id },
        data: {
          ...(name === undefined ? {} : { name }),
          ...(drinkType === undefined ? {} : { drinkType }),
          ...(categories === undefined
            ? {}
            : {
                categories: categories
                  .split(",")
                  .map((category) => category.trim().toLowerCase())
                  .filter((category) => category !== "")
                  .join(","),
              }),
        },
        include: { menuItems: true },
      })
      .catch(() => {
        throw new BadRequestError("The menu detail is already exist");
      });

    return updatedMenu;
  }

  async updateMenuItem({
    id,
    item,
    picture,
  }: { item: z.infer<typeof updateMenuItemSchema> } & {
    id: string;
    picture?: string;
  }) {
    // Check if the id and menu id is valid
    const menu = await prisma.menu
      .findUniqueOrThrow({
        where: {
          id,
          menuItems: {
            some: { id: item.id },
          },
        },
        include: { menuItems: true },
      })
      .catch((_) => {
        console.log(_);
        throw new BadRequestError("Invalid menu id or menu item id");
      });

    const updateMenuItem = await this.prisma.menuItem.update({
      where: { id: item.id },
      data: {
        price: item.price,
        isActive: item.isActive,
        ...(picture === undefined ? {} : { picture: picture }),
      },
    });

    // Add updated menu item to menu
    menu.menuItems = menu.menuItems.map((menuItem) => {
      if (menuItem.id === updateMenuItem.id) {
        return updateMenuItem;
      }
      return menuItem;
    });

    return menu;
  }
}

export default new MenuService();
