import { Response, NextFunction, Request } from "express";
import { cloudinary } from "../config/cloudinary";
import sharp from "sharp";
import { BadRequestError } from "../models/error";

export async function menuPictureMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.files && req.body.items) {
    const images = [] as Express.Multer.File[];

    for (let i = 0; i < 3; i++) {
      //@ts-ignore
      const image = req.files[`items[${i}][picture]`];
      if (image) {
        images.push(image[0]);
      } else {
        // Push empty object to keep the index
        images.push({} as Express.Multer.File);
      }
    }

    const sharpPromises = images.map((image, index) => {
      if (Object.keys(image).length === 0) {
        return Promise.resolve(); // Resolve immediately for empty images
      }

      return new Promise((resolve, reject) => {
        sharp(image.buffer)
          .resize({ width: 200, height: 200 })
          .jpeg()
          .toBuffer((err, buffer) => {
            if (err) {
              reject(err);
            } else {
              // Use cloudinary.uploader here
              cloudinary.uploader
                .upload_stream(
                  {
                    public_id: req.body.items[index].id,
                    filename_override: req.body.items[index].id,
                    folder: "menu",
                    format: "jpg",
                  },
                  async (err, result) => {
                    if (err || !result) {
                      reject(new BadRequestError("Something went wrong."));
                      return;
                    }

                    req.body.items[index].image = result.secure_url;
                    resolve(null);
                    return;
                  }
                )
                .end(buffer);
            }
          });
      });
    });

    try {
      // Wait for all promises to resolve
      await Promise.all(sharpPromises);
      next();
    } catch (error) {
      next(new BadRequestError("Error processing images."));
    }
  } else {
    next();
  }
}
