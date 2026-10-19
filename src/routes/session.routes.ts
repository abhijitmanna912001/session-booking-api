import { Router } from "express";
import {
  bookSession,
  completeSession,
  createSession,
  getAvailableSessions,
} from "../controllers/session.controller";

export const sessionRouter = Router();

sessionRouter.get("/available", getAvailableSessions);
sessionRouter.post("/", createSession);
sessionRouter.post("/:id/book", bookSession);
sessionRouter.patch("/:id/complete", completeSession);
