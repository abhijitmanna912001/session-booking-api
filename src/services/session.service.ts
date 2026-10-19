import { Session } from "../models/session.model";
import { Teacher } from "../models/teacher.model";
import { AppError } from "../utils/AppError";
import type { CreateSessionInput } from "../validators/session.validator";

export async function createSession(input: CreateSessionInput) {
  const teacherExists = await Teacher.exists({ _id: input.teacherId });
  if (!teacherExists) {
    throw new AppError(404, "Teacher not found");
  }

  return Session.create({
    teacherId: input.teacherId,
    startTime: input.startTime,
    endTime: input.endTime,
  });
}
