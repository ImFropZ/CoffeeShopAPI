import { BadRequestError } from "./../models/error";
import { Request, Response } from "express";
import customerService from "../services/customer";
import * as z from "zod";
import { createCustomerSchema, updateCustomerSchema } from "../schema";

export async function customers(req: Request, res: Response) {
  const customers = await customerService.getCustomers();
  res.json({ data: customers });
}

export async function customer(req: Request, res: Response) {
  const id = await z
    .string()
    .uuid()
    .parseAsync(req.params.id)
    .catch((_) => {
      throw new BadRequestError("Invalid customer id");
    });

  const customer = await customerService.getCustomer(id);

  res.json({ data: customer });
}

export async function invoices(req: Request, res: Response) {
  const id = await z
    .string()
    .uuid()
    .parseAsync(req.params.id)
    .catch((_) => {
      throw new BadRequestError("Invalid customer id");
    });

  const invoices = await customerService.getCustomerOrders(id);

  res.json({ data: invoices });
}

export async function createCustomer(req: Request, res: Response) {
  const customer = await createCustomerSchema
    .parseAsync(req.body)
    .catch((_) => {
      throw new BadRequestError("Invalid customer data");
    });

  const createdCustomer = await customerService.createCustomer(customer);

  res.json({ data: createdCustomer });
}

export async function updateCustomer(req: Request, res: Response) {
  const id = await z
    .string()
    .uuid()
    .parseAsync(req.params.id)
    .catch((_) => {
      throw new Error("Invalid customer id");
    });

  const customer = await updateCustomerSchema
    .parseAsync(req.body)
    .catch((_) => {
      throw new BadRequestError("Invalid customer data");
    });

  const updatedCustomer = await customerService.updateCustomer(id, customer);

  res.json({ data: updatedCustomer });
}
