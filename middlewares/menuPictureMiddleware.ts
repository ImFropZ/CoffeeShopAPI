import { Response, NextFunction, Request } from "express";
import { cloudinary } from "../config/cloudinary";
import sharp from "sharp";
import { BadRequestError } from "../models/error";

export async function menuPictureMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.file && req.body.id) {
    sharp(req.file.buffer)
      .resize(200, 200)
      .toFormat("jpeg")
      .toBuffer((err, buffer) => {
        if (err) {
          throw new BadRequestError("Input file is not supported");
        }

        cloudinary.uploader
          .upload_stream(
            {
              folder: "menu",
              public_id: req.body.id,
              format: "jpg",
            },
            (err, result) => {
              if (err || !result) {
                throw new BadRequestError("Something went wrong.");
              }

              res.locals.menu.picture = {
                url: result.secure_url,
              };
              next();
            }
          )
          .end(buffer);
      });
  }

  next();
}
