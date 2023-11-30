import { Response, NextFunction, Request } from "express";
import { BadRequestError } from "../models/error";
import moment from "moment";

export async function queryMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { query } = req;
  const { start_date, end_date } = query;

  if (start_date && !end_date) {
    throw new BadRequestError("end_date query is required");
  }

  if (end_date && !start_date) {
    throw new BadRequestError("start_date query is required");
  }

  if (start_date && end_date) {
    res.locals.dateRange = {
      start: start_date ? moment(start_date as string) : moment(),
      end: end_date ? moment(end_date as string) : moment(),
    };
  }

  next();
}
