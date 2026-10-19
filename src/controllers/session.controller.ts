import type { Request, Response } from "express";
import { availableSessionsQuerySchema, createSessionSchema } from "../validators/session.validator";
import * as sessionService from "../services/session.service";

export async function getAvailableSessions(req: Request, res: Response): Promise<void> {
  const { dateTimestamp } = availableSessionsQuerySchema.parse(req.query);
  const sessions = await sessionService.getAvailableSessions(dateTimestamp);
  res.status(200).json({ success: true, count: sessions.length, data: sessions });
}

export async function createSession(
  req: Request,
  res: Response,
): Promise<void> {
  const input = createSessionSchema.parse(req.body);
  const session = await sessionService.createSession(input);
  res.status(201).json({ success: true, data: session });
}
