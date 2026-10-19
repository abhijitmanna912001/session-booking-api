import { Schema, model, type InferSchemaType } from "mongoose";

export const SessionStatus = {
  AVAILABLE: "AVAILABLE",
  BOOKED: "BOOKED",
  COMPLETED: "COMPLETED",
} as const;

export type SessionStatusType =
  (typeof SessionStatus)[keyof typeof SessionStatus];

const sessionSchema = new Schema(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(SessionStatus),
      default: SessionStatus.AVAILABLE,
      required: true,
    },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

sessionSchema.index({ status: 1, startTime: 1 }); // API 3
sessionSchema.index({ userId: 1, status: 1 }); // API 6

export type ISession = InferSchemaType<typeof sessionSchema>;
export const Session = model("Session", sessionSchema);
