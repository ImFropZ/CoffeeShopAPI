import { Router } from "express";
import { use } from "../utils";
import { authorizeMiddleware } from "../middlewares/authorizeMiddleware";
import { adminValidatorMiddleware } from "../middlewares/roleValidatorMiddlware";
import { users } from "../controllers/user";
const api = Router();

api.get(
  "/",
  use(authorizeMiddleware),
  use(adminValidatorMiddleware),
  use(users)
);

export default api;
