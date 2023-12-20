import { Request, Response } from "express";
import userService from "../services/user";

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
