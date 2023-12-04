import { Response, NextFunction, Request } from "express";
import { cloudinary } from "../config/cloudinary";
import sharp from "sharp";
import { BadRequestError } from "../models/error";

export async function menuPictureMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.file) {
    sharp(req.file.buffer)
      .resize(200, 200)
      .toFormat("jpeg")
      .toBuffer((err, buffer) => {
        if (err) {
          throw new BadRequestError("Input file is not supported");
        }

        console.log;

        // Check if request is PUT or POST
        if (req.method === "POST") {
          res.locals.menu = {
            picture: buffer,
          };
          return next();
        }

        cloudinary.uploader
          .upload_stream(
            {
              public_id: req.params.id,
              filename_override: req.params.id,
              folder: "menu",
              format: "jpg",
            },
            (err, result) => {
              if (err || !result) {
                throw new BadRequestError("Something went wrong.");
              }

              res.locals.menu = {
                picture: result.secure_url,
              };

              next();
            }
          )
          .end(buffer);
      });
  } else {
    next();
  }
}
