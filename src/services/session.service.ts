import { Types } from "mongoose";
import { Session, SessionStatus } from "../models/session.model";
import { Teacher } from "../models/teacher.model";
import { User } from "../models/user.model";
import { AppError } from "../utils/AppError";
import type { CreateSessionInput } from "../validators/session.validator";

const DAY_MS = 24 * 60 * 60 * 1000;

export async function getAvailableSessions(dateTimestamp: number) {
  const day = new Date(dateTimestamp);
  const dayStart = new Date(
    Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()),
  );
  const dayEnd = new Date(dayStart.getTime() + DAY_MS);

  return Session.aggregate([
    {
      $match: {
        status: SessionStatus.AVAILABLE,
        startTime: { $gte: dayStart, $lt: dayEnd },
      },
    },
    { $sort: { startTime: 1 } },
    {
      $lookup: {
        from: Teacher.collection.name,
        localField: "teacherId",
        foreignField: "_id",
        as: "teacher",
      },
    },
    { $unwind: { path: "$teacher", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        startTime: 1,
        endTime: 1,
        status: 1,
        teacher: {
          _id: "$teacher._id",
          fullName: "$teacher.fullName",
          specialization: "$teacher.specialization",
          experience: "$teacher.experience",
        },
      },
    },
  ]);
}

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

export async function bookSession(sessionId: string, userId: string) {
  const userExists = await User.exists({ _id: userId });
  if (!userExists) {
    throw new AppError(404, "User not found");
  }

  const booked = await Session.findOneAndUpdate(
    { _id: sessionId, status: SessionStatus.AVAILABLE },
    {
      $set: {
        status: SessionStatus.BOOKED,
        userId: new Types.ObjectId(userId),
      },
    },
    { new: true },
  );
  if (booked) {
    return booked;
  }

  const existing = await Session.findById(sessionId).select("status");
  if (!existing) {
    throw new AppError(404, "Session not found");
  }
  throw new AppError(
    409,
    `Session cannot be booked, current status is ${existing.status}`,
  );
}
