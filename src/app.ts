import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";

// Load .env file contents into process.env
dotenv.config();

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});

// If port number is not specified in the environment, use port 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`The server has started on port ${PORT}`));
