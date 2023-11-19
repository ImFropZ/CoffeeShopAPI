import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import api from "./api";
import { ResponseError } from "./models/error";

require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1", api);

app.use(
  (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ResponseError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
