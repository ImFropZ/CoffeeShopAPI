import { Request, Response } from "express";
import { orderSchema, userLocalsSchema } from "../schema";
import { BadRequestError } from "../models/error";
import orderService from "../services/order";

export async function order(req: Request, res: Response) {
  const order = await orderSchema.parseAsync(req.body).catch((_) => {
    throw new BadRequestError("Invalid order data");
  });

  const { username } = await userLocalsSchema
    .parseAsync(res.locals.user)
    .catch((_) => {
      throw new BadRequestError("Invalid user data");
    });

  const isSuccess = await orderService.order({ ...order, username: username });

  if (!isSuccess) {
    throw new BadRequestError(
      "Unable to order the items at the moment. Please try again later"
    );
  }

  res.json({ data: "Your order is completed" });
}
