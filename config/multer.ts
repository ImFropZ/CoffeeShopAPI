import multer from "multer";
import { BadRequestError } from "../models/error";

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new BadRequestError("Only images are allowed!"), false);
  } else {
    cb(null, true);
  }
};

export const upload = multer({ storage, fileFilter }).single("image");
