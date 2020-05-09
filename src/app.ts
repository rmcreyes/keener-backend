import express, { Application, Request, Response } from "express";

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});

const PORT = process.env.PORT || 5000;

app.listen(5000, () => console.log(`The server has started on port ${PORT}`));
