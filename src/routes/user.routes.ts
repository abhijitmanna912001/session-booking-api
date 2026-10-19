import { Router } from "express";
import { createUser, getUserSessions } from "../controllers/user.controller";

export const userRouter = Router();

userRouter.get("/:id/sessions", getUserSessions);
userRouter.post("/", createUser);
