import { Router } from "express";
import {
  createSession,
  getAvailableSessions,
} from "../controllers/session.controller";

export const sessionRouter = Router();

sessionRouter.post("/", createSession);
sessionRouter.get("/available", getAvailableSessions);
