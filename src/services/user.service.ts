import { User } from "../models/user.model";
import type { CreateUserInput } from "../validators/user.validator";

export async function createUser(input: CreateUserInput) {
  return User.create(input);
}
