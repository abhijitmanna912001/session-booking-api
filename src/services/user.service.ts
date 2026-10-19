import { Types } from "mongoose";
import { Session, SessionStatus } from "../models/session.model";
import { User } from "../models/user.model";
import { AppError } from "../utils/AppError";
import type { CreateUserInput } from "../validators/user.validator";
import { Teacher } from "../models/teacher.model";

export async function createUser(input: CreateUserInput) {
  return User.create(input);
}

export async function getUserSessions(userId: string) {
  const userExists = await User.exists({ _id: userId });
  if (!userExists) {
    throw new AppError(404, "User not found");
  }

  const [result] = await Session.aggregate([
    { $match: { userId: new Types.ObjectId(userId) } },
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
        completedAt: 1,
        teacher: {
          _id: "$teacher._id",
          fullName: "$teacher.fullName",
          specialization: "$teacher.specialization",
          experience: "$teacher.experience",
        },
      },
    },
    {
      $facet: {
        upcoming: [
          { $match: { status: SessionStatus.BOOKED } },
          { $sort: { startTime: 1 } },
        ],
        completed: [
          { $match: { status: SessionStatus.COMPLETED } },
          { $sort: { completedAt: -1 } },
        ],
      },
    },
  ]);

  return result ?? { upcoming: [], completed: [] };
}
