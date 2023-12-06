import * as z from "zod";
import { createMenuSchema, updateMenuSchema } from "../schema";
import { BadRequestError } from "../models/error";
import { cloudinary } from "../config/cloudinary";
import { prisma } from "../config/prisma";

class MenuService {
  prisma = prisma;

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
  }: z.infer<typeof createMenuSchema> & { picture: Buffer }) {
    const menu = await this.prisma.menu
      .create({
        data: {
          name,
          picture: "",
          price,
          cupSize,
        },
      })
      .catch(() => {
        throw new BadRequestError("The menu is already exist");
      });

    const pictureUrl = await new Promise(
      (resolve: (value: string) => void, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              public_id: menu.id,
              filename_override: menu.id,
              folder: "menu",
              format: "jpg",
            },
            async (err, result) => {
              if (err || !result) {
                throw new BadRequestError("Something went wrong.");
              }

              const { picture } = await this.prisma.menu
                .update({
                  where: {
                    id: menu.id,
                  },
                  data: {
                    picture: result.secure_url,
                  },
                })
                .catch((_) => {
                  throw new BadRequestError(
                    "Something is wrong with the file."
                  );
                });

              resolve(picture as string);
            }
          )
          .end(picture);
      }
    );

    return {
      id: menu.id,
      name: menu.name,
      picture: pictureUrl,
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
  }: z.infer<typeof updateMenuSchema> & { id: string; picture?: string }) {
    const updatedMenu = await this.prisma.menu
      .update({
        where: { id },
        data: {
          ...(name === undefined ? {} : { name }),
          ...(picture === undefined ? {} : { picture }),
          ...(price === undefined ? {} : { price }),
          ...(cupSize === undefined ? {} : { cupSize }),
        },
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
