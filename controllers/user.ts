import { Request, Response } from "express";
import userService from "../services/user";
import { updateUserSchema } from "../schema";
import { BadRequestError } from "../models/error";

export async function users(req: Request, res: Response) {
  const users = await userService.getUsers();

  const response = users.map((user) => {
    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      role: user.role,
      email: user.email,
    };
  });
  return res.json({ data: response });
}

export async function updateUser(req: Request, res: Response) {
  const { username } = req.params;

  const data = await updateUserSchema.parseAsync(req.body).catch((err) => {
    throw new BadRequestError("Update user data is invalid");
  });

  const user = await userService.updateUser(username, data);

  const response = {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    role: user.role,
    email: user.email,
  };

  return res.json({ data: response });
}
