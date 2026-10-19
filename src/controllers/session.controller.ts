import type { Request, Response } from "express";
import { createSessionSchema } from "../validators/session.validator";
import * as sessionService from "../services/session.service";

export async function createSession(
  req: Request,
  res: Response,
): Promise<void> {
  const input = createSessionSchema.parse(req.body);
  const session = await sessionService.createSession(input);
  res.status(201).json({ success: true, data: session });
}
