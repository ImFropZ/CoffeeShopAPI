import { Request, Response } from "express";
import menuService from "../services/menu";
import { createMenuSchema, updateMenuSchema } from "../schema";
import { BadRequestError } from "../models/error";

export async function menus(req: Request, res: Response) {
  const menus = await menuService.menus();
  res.json({ data: menus });
}

export async function createMenu(req: Request, res: Response) {
  const menu = await createMenuSchema.parseAsync(req.body).catch((_) => {
    throw new BadRequestError("Invalid menu data");
  });

  const createdMenu = await menuService.createMenu(menu);
  res.json({ data: createdMenu });
}

export async function updateMenu(req: Request, res: Response) {
  const { id } = req.params;
  const menu = await updateMenuSchema
    .parseAsync({ id, ...req.body })
    .catch((_) => {
      throw new BadRequestError("Invalid menu data");
    });

  const updatedMenu = await menuService.updateMenu(menu);

  res.json({ data: updatedMenu });
}
