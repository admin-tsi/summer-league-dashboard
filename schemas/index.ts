import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string(),
});

export const UserSchema = z.object({
  _id: z.string(),
  age: z.string(),
  email: z.string().email(),
  firstname: z.string(),
  isverified: z.boolean(),
  lastname: z.string(),
  phone: z.string(),
  role: z.string(),
  clientData: z.any(),
});
