import { Router } from "express";
import { use } from "../utils";
import { authorizeMiddleware } from "../middlewares/authorizeMiddleware";
import { createMenu, menus, updateMenu } from "../controllers/menu";
const api = Router();

api.get("/", authorizeMiddleware, use(menus));
api.post("/", authorizeMiddleware, use(createMenu));
api.put("/:id", authorizeMiddleware, use(updateMenu));

export default api;
