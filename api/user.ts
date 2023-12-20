import { Router } from "express";
import { use } from "../utils";
import { authorizeMiddleware } from "../middlewares/authorizeMiddleware";
import { adminValidatorMiddleware } from "../middlewares/roleValidatorMiddlware";
import { users, updateUser } from "../controllers/user";
const api = Router();

api.get(
  "/",
  use(authorizeMiddleware),
  use(adminValidatorMiddleware),
  use(users)
);

api.put(
  "/:username",
  use(authorizeMiddleware),
  use(adminValidatorMiddleware),
  use(updateUser)
);

export default api;
