import { Router } from "express";
import { use } from "../utils";
import { authorizeMiddleware } from "../middlewares/authorizeMiddleware";
import { createMenu, menus, updateMenu } from "../controllers/menu";
import { adminValidatorMiddleware } from "../middlewares/roleValidatorMiddlware";
import { upload } from "../config/multer";
import { menuPictureMiddleware } from "../middlewares/menuPictureMiddleware";
const api = Router();

api.get("/", use(authorizeMiddleware), use(menus));
api.post(
  "/",
  use(authorizeMiddleware),
  use(adminValidatorMiddleware),
  use(upload),
  use(menuPictureMiddleware),
  use(createMenu)
);
api.put(
  "/:id",
  use(authorizeMiddleware),
  use(adminValidatorMiddleware),
  use(upload),
  use(menuPictureMiddleware),
  use(updateMenu)
);

export default api;
