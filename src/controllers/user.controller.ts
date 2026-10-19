import type { Request, Response } from "express";
import { createUserSchema } from "../validators/user.validator";
import * as userService from "../services/user.service";

export async function createUser(req: Request, res: Response): Promise<void> {
  const input = createUserSchema.parse(req.body);
  const user = await userService.createUser(input);
  res.status(201).json({ success: true, data: user });
}
