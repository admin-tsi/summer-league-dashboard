import * as z from "zod";

export const teamCreationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  city: z.string().min(1, { message: "City is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  division: z.string().min(1, { message: "Division is required" }),
});
