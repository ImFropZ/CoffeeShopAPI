import { Request, Response, Router } from "express";
import { use } from "../utils";
const api = Router();

api.get(
  "/login",
  use((req: Request, res: Response) => {
    throw new Error("Error");
    res.send("Login");
  })
);

api.get("/logout", (req: Request, res: Response) => {
  res.status(200).send("Logout");
});

export default api;
