import { Router } from "express";
import { createSession } from "../controllers/session.controller";

export const sessionRouter = Router();

sessionRouter.post("/", createSession);
