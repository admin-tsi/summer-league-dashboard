import { z } from "zod";

export const UserSchema = z.object({
  _id: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number(),
  specialization: z.string(),
  countryCode: z.string(),
  phoneNumber: z.string(),
  dateOfBirth: z.string(),
  address: z.string(),
});
