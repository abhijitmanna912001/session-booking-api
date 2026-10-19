import express from "express";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes get mounted here in later steps, before the two handlers below.

app.use(notFoundHandler);
app.use(errorHandler);
