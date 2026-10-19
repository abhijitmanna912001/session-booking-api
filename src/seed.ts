import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { Teacher } from "./models/teacher.model";

async function seed(): Promise<void> {
  await connectDB();
  await Teacher.deleteMany({});
  const teachers = await Teacher.insertMany([
    {
      fullName: "Anita Sharma",
      email: "anita@example.com",
      specialization: "Mathematics",
      experience: 8,
    },
    {
      fullName: "Rahul Verma",
      email: "rahul@example.com",
      specialization: "Physics",
      experience: 5,
    },
  ]);
  console.log("Seeded teachers:");
  teachers.forEach((t) => console.log(`${t.fullName}: ${t._id}`));
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
