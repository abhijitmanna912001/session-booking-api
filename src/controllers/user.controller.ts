import type { Request, Response } from "express";
import {
  createUserSchema,
  userIdParamSchema,
} from "../validators/user.validator";
import * as userService from "../services/user.service";

export async function createUser(req: Request, res: Response): Promise<void> {
  const input = createUserSchema.parse(req.body);
  const user = await userService.createUser(input);
  res.status(201).json({ success: true, data: user });
}

export async function getUserSessions(
  req: Request,
  res: Response,
): Promise<void> {
  const { id } = userIdParamSchema.parse(req.params);
  const data = await userService.getUserSessions(id);
  res.status(200).json({ success: true, data });
}
