import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const fileSchema = z.object({
  name: z.string(),
  size: z.number().max(MAX_FILE_SIZE, "File size must be less than 5MB"),
  type: z.string().refine((type: any) => ALLOWED_FILE_TYPES.includes(type), {
    message: `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(", ")}`,
  }),
});

type FileSchemaType = z.infer<typeof fileSchema>;

export const playerSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  playerImage: fileSchema.refine(
    (data: FileSchemaType) => data !== undefined && data !== null,
    {
      message: "Player image is required",
    }
  ),
  dorseyNumber: z.string().min(1, { message: "Dorsey Number is required" }),
  college: z.string().min(1, { message: "College is required" }),
  nationality: z.string().min(1, { message: "Nationality is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  fullNumber: z.string().min(1, { message: "Full Number is required" }),
  yearsOfExperience: z
    .string()
    .min(1, { message: "Years of Experience is required" }),
  position: z.string().min(1, { message: "Position is required" }),
  height: z.string().min(1, { message: "Height is required" }),
  weight: z.string().min(1, { message: "Weight is required" }),
  birthCertificate: fileSchema.refine(
    (data: FileSchemaType) => data !== undefined && data !== null,
    {
      message: "Birth certificate is required",
    }
  ),
  cipFile: fileSchema.refine(
    (data: FileSchemaType) => data !== undefined && data !== null,
    {
      message: "CIP certificate is required",
    }
  ),
});
