import { Request, Response } from "express";
import menuService from "../services/menu";
import { createMenuSchema, updateMenuSchema } from "../schema";
import { BadRequestError } from "../models/error";

export async function menus(req: Request, res: Response) {
  const menus = await menuService.menus();

  // Filter array of object and get the name of the menu only unique
  const menuNames = menus
    .filter((menu, index, self) => {
      return index === self.findIndex((m) => m.name === menu.name);
    })
    .map((menu) => {
      return {
        name: menu.name,
        picture: menu.picture,
      };
    });

  const menuResponse = menuNames.map((menu) => {
    const items = menus.filter((m) => m.name === menu.name);

    return {
      ...menu,
      data: items.map((m) => {
        return {
          id: m.id,
          picture: m.picture,
          price: m.price,
          cupSize: m.cupSize,
        };
      }),
    };
  });

  res.json({ data: menuResponse });
}

export async function createMenu(req: Request, res: Response) {
  const menu = await createMenuSchema.parseAsync(req.body).catch((_) => {
    console.log(_);
    throw new BadRequestError("Invalid menu data");
  });

  const createdMenu = await menuService.createMenu({
    ...menu,
    picture: (res.locals.menu?.picture as Buffer) ?? undefined,
  });
  res.json({ data: createdMenu });
}

export async function updateMenu(req: Request, res: Response) {
  const { id } = req.params;
  const menu = await updateMenuSchema.parseAsync(req.body).catch((_) => {
    throw new BadRequestError("Invalid menu data");
  });

  const updatedMenu = await menuService.updateMenu({
    ...menu,
    id,
    picture: res.locals.menu.picture ?? undefined,
  });

  res.json({ data: updatedMenu });
}
