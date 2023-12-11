import { Request, Response } from "express";
import menuService from "../services/menu";
import {
  createMenuSchema,
  updateMenuItemSchema,
  updateMenuSchema,
} from "../schema";
import { BadRequestError } from "../models/error";
import { z } from "zod";

export async function menus(req: Request, res: Response) {
  const menus = await menuService.menus();

  const response = menus.map((menu) => {
    return {
      id: menu.id,
      name: menu.name,
      drinkType: menu.drinkType,
      categories: menu.categories.split(",").map((category) => category.trim()),
      menuItems: menu.menuItems.map((menuItem) => {
        return {
          id: menuItem.id,
          cupSize: menuItem.cupSize,
          price: menuItem.price,
          picture: menuItem.picture,
          isActive: menuItem.isActive,
        };
      }),
    };
  });

  res.json({ data: response });
}

export async function createMenu(req: Request, res: Response) {
  const menu = await createMenuSchema.parseAsync(req.body).catch((_) => {
    throw new BadRequestError("Invalid menu data");
  });

  const createdMenu = await menuService.createMenu(menu);

  const response = {
    ...createdMenu,
    categories: createdMenu.categories
      .split(",")
      .map((category) => category.trim()),
  };

  res.json({ data: response });
}

export async function updateMenu(req: Request, res: Response) {
  const { id } = req.params;
  const menu = await updateMenuSchema.parseAsync(req.body).catch((_) => {
    throw new BadRequestError("Invalid menu data");
  });

  const updatedMenu = await menuService.updateMenu({
    ...menu,
    id,
  });

  res.json({
    data: { ...updatedMenu, categories: updatedMenu.categories.split(",") },
  });
}

export async function updateMenuItem(req: Request, res: Response) {
  const id = await z
    .string()
    .uuid()
    .parseAsync(req.params.id)
    .catch((_) => {
      throw new BadRequestError("Invalid menu id");
    });

  const item = await updateMenuItemSchema.parseAsync(req.body).catch((_) => {
    throw new BadRequestError("Invalid menu item data");
  });

  const updatedMenu = await menuService.updateMenuItem({
    id,
    item,
    picture: res.locals.picture,
  });

  res.json({ data: updatedMenu });
}

export async function categories(req: Request, res: Response) {
  const data = await menuService.categories();

  const responseSet = new Set(
    data
      .flatMap((entry) => entry.categories.split(","))
      .map((category) => category.trim())
  );

  res.json({ data: Array.from(responseSet) });
}
