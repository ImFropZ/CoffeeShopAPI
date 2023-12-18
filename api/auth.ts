import { Router } from "express";
import {
  verifyToken,
  forgotPassword,
  login,
  register,
  profile,
  updateProfile,
} from "../controllers/auth";
import { use } from "../utils";
import { authorizeMiddleware } from "../middlewares/authorizeMiddleware";
import { upload } from "../config/multer";
import { profilePictureMiddleware } from "../middlewares/profilePictureMiddleware";
const api = Router();

api.get("/me", use(authorizeMiddleware), use(profile));

api.post("/login", use(login));
api.post("/register", use(register));
api.post("/forgot-password", use(forgotPassword));
api.post("/verify-token", use(verifyToken));

api.put(
  "/me",
  use(authorizeMiddleware),
  use(upload.single("image")),
  use(profilePictureMiddleware),
  use(updateProfile)
);

export default api;
