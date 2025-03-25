import { UseFormReturn } from "react-hook-form";
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { ConfettiRef } from "@/components/magicui/confetti";
import { RegisterSchema } from "@/lib/schemas/auth/register";
import { z } from "zod";

export type Inputs = z.infer<typeof RegisterSchema>;

export interface StepProps {
  form: UseFormReturn<Inputs>;
  delta: number;
}

export interface StepThreeProps extends StepProps {
  isTermsAccepted: boolean;
  setIsTermsAccepted: Dispatch<SetStateAction<boolean>>;
  termsError: boolean;
}

export interface StepCompleteProps {
  formError: string | null;
  confettiRef: MutableRefObject<ConfettiRef | null>;
}
