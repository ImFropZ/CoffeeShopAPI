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

  async menus({ category }: { category?: string }) {
    const menus = await this.prisma.menu.findMany({
      include: {
        menuItems: true,
      },
      where: {
        categories: {
          contains: category,
        },
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
    items,
  }: { items: z.infer<typeof updateMenuItemSchema> } & {
    id: string;
    picture?: string;
  }) {
    // Check if the id and menu id is valid
    const menu = await prisma.menu
      .findUniqueOrThrow({
        where: {
          id,
          menuItems: {
            some: { id: { in: items.map((item) => item.id) } },
          },
        },
        include: { menuItems: true },
      })
      .catch((_) => {
        console.log(_);
        throw new BadRequestError("Invalid menu id or menu item id");
      });

    const updateMenuItems = items.map(async (item) => {
      return await this.prisma.menuItem.update({
        where: { id: item.id },
        data: {
          ...(!item.image ? {} : { picture: item.image }),
          price: item.price,
          isActive: item.isActive,
        },
      });
    });

    await Promise.all(updateMenuItems);

    const updatedMenu = await this.prisma.menu.findUnique({
      where: { id },
      include: { menuItems: true },
    });

    return updatedMenu;
  }

  categories = async () => {
    const categories = await this.prisma.menu.findMany({
      where: {
        menuItems: {
          some: {
            isActive: true,
          }
        }
      },
      select: {
        categories: true,
      },
    });
    return categories;
  };
}

export default new MenuService();
