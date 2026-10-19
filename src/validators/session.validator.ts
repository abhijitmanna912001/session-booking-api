import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Must be a valid ObjectId");

export const sessionIdParamSchema = z.object({ id: objectId });

export const bookSessionSchema = z.object({ userId: objectId });

const isoDate = z.iso
  .datetime({
    offset: true,
    message: "Must be an ISO 8601 datetime, e.g. 2026-10-20T10:00:00Z",
  })
  .transform((value) => new Date(value));

export const createSessionSchema = z
  .object({
    teacherId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "teacherId must be a valid ObjectId"),
    startTime: isoDate,
    endTime: isoDate,
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "endTime must be greater than startTime",
    path: ["endTime"],
  });

export const availableSessionsQuerySchema = z.object({
  dateTimestamp: z.coerce
    .number({
      message: "dateTimestamp must be a number (milliseconds since epoch)",
    })
    .int()
    .positive()
    .max(8.64e15, "dateTimestamp is out of range"),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
