import { z } from "zod";

export const players = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  playerImage: z
    .union([z.string(), z.instanceof(File), z.undefined()])
    .optional(),
  dorseyNumber: z
    .number({ message: "Dorsey Number is required and must be a number" })
    .nonnegative("Dorsey Number must be a non-negative number")
    .int("Dorsey Number must be an integer"),
  college: z.string().min(1, { message: "College is required" }),
  nationality: z.string().min(1, { message: "Nationality is required" }),
  playerEmail: z.union([z.string().email(), z.string().length(0)]).optional(),
  countryCode: z.string().optional(),
  phoneNumber: z.number().optional(),
  position: z.string().min(1, { message: "Position is required" }),
  height: z
    .number({ message: "Height is required and must be a number" })
    .positive("Height must be a positive number"),
  weight: z
    .number({ message: "Weight is required and must be a number" })
    .positive("Weight must be a positive number")
    .min(1, { message: "Weight is required" }),
  birthdate: z
    .string()
    .min(1, "Date of birth is required")
    .max(25, "Invalid date of birth")
    .refine((value) => {
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age >= 15;
    }, "You must be at least 15 years old"),
});

export const playerEditSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  playerImage: z
    .union([z.string(), z.instanceof(File), z.undefined()])
    .optional(),
  dorseyNumber: z
    .number({ message: "Dorsey Number is required and must be a number" })
    .nonnegative("Dorsey Number must be a non-negative number")
    .int("Dorsey Number must be an integer")
    .optional(),
  college: z.string().optional(),
  nationality: z.string().optional(),
  playerEmail: z.union([z.string().email(), z.string().length(0)]).optional(),
  countryCode: z.string().optional(),
  phoneNumber: z.number().positive().optional(),
  position: z.string().optional(),
  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  birthdate: z.string().optional(),
});

export const playerValidationSchema = z.object({
  status: z.string().min(1, { message: "Decision is required" }),
  comment: z.string().optional(),
});
