import { Response, NextFunction, Request } from "express";
import { cloudinary } from "../config/cloudinary";
import sharp from "sharp";
import { BadRequestError } from "../models/error";
import { prisma } from "../config/prisma";

export async function profilePictureMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.locals.user.id) {
    return next();
  }

  if (req.file) {
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
              public_id: res.locals.user.id,
              filename_override: res.locals.user.id,
              folder: "profile",
              format: "jpg",
            },
            async (err, result) => {
              if (err || !result) {
                throw new BadRequestError("Something went wrong.");
              }

              await prisma.user
                .update({
                  where: {
                    id: res.locals.user.id,
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
                
              next();
            }
          )
          .end(buffer);
      });
  } else {
    res.locals.user.picture = {
      url: "",
    };
    next();
  }
}
