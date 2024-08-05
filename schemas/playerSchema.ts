import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "image/webp",
];

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
  dorseyNumber: z
    .number({ message: "Dorsey Number is required and must be a number" })
    .positive("Dorsey Number must be a positive number"),
  college: z.string().min(1, { message: "College is required" }),
  nationality: z.string().min(1, { message: "Nationality is required" }),
  playerEmail: z.string().email({ message: "Invalid email address" }),
  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z
    .number({ message: "Phone Number is required and must be a number" })
    .positive("Height must be a positive number"),
  yearsOfExperience: z
    .string()
    .min(1, { message: "Years of Experience is required" }),
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
