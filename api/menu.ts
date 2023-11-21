import { Router } from "express";
import { use } from "../utils";
import { authorizeMiddleware } from "../middlewares/authorizeMiddleware";
import { createMenu, menus, updateMenu } from "../controllers/menu";
import { adminValidatorMiddleware } from "../middlewares/roleValidatorMiddlware";
const api = Router();

api.get("/", authorizeMiddleware, use(menus));
api.post("/", authorizeMiddleware, adminValidatorMiddleware, use(createMenu));
api.put("/:id", authorizeMiddleware, adminValidatorMiddleware, use(updateMenu));

export default api;
