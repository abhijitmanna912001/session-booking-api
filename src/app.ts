import express from "express";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import { userRouter } from "./routes/user.routes";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/users", userRouter);

app.use(notFoundHandler);
app.use(errorHandler);
