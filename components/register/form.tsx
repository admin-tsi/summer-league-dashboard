"use client";

import { Button } from "@/components/ui/button";
import { steps } from "@/constants/register/registerSteps";
import { submitForm } from "@/lib/api/auth/register";
import { RegisterSchema } from "@/lib/schemas/auth/register";
import logo from "@/public/logo.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import LoadingSpinner from "../loading-spinner";
import { ConfettiRef } from "../magicui/confetti";
import { StepComplete } from "./steps/StepComplete";
import { StepOne } from "./steps/stepOne";
import { StepThree } from "./steps/StepThree";
import { StepTwo } from "./steps/stepTwo";
import { Inputs } from "@/types/register/registerTypes";

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const confettiRef = useRef<ConfettiRef>(null);
  const delta = currentStep - previousStep;

  const form = useForm<Inputs>({
    resolver: zodResolver(RegisterSchema),
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    setValue,
    formState: { errors },
  } = form;

  const processForm: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsSubmitting(true);
      await submitForm(data);
      setFormError(null);
      localStorage.removeItem("formData");
    } catch (error: any) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  type FieldName = keyof Inputs;

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });

    if (currentStep === steps.length - 2) {
      if (!isTermsAccepted) {
        setTermsError(true);
        return;
      } else {
        await handleSubmit(processForm)();
      }
    }

    if (!output) return;

    setPreviousStep(currentStep);
    setCurrentStep((step) => step + 1);
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("formData");
      if (savedData) {
        reset(JSON.parse(savedData));
      }

      const subscription = watch((data) => {
        localStorage.setItem("formData", JSON.stringify(data));
      });

      return () => subscription.unsubscribe();
    }
  }, [reset, watch]);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepOne form={form} delta={delta} />;
      case 1:
        return <StepTwo form={form} delta={delta} />;
      case 2:
        return (
          <StepThree
            form={form}
            delta={delta}
            isTermsAccepted={isTermsAccepted}
            setIsTermsAccepted={setIsTermsAccepted}
            termsError={termsError}
          />
        );
      case 3:
        return <StepComplete formError={formError} confettiRef={confettiRef} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-full h-full overflow-y-scroll md:h-fit md:w-1/3 p-5 rounded-lg bg-muted shadow-2xl border-none">
        <nav aria-label="Progress" className="flex flex-col space-y-10">
          <div className="w-full flex justify-center items-center">
            <Image src={logo} alt="AWSP Logo" width={72} height={50} />
          </div>
          <ol
            role="list"
            className="flex w-full space-x-2 md:space-x-8 md:space-y-0"
          >
            {steps.map((step, index) => (
              <li key={step.id} className="w-1/4 md:flex-1">
                {currentStep > index ? (
                  <div className="group flex w-full flex-col border-t-4 border-primary py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-prborder-primary transition-colors">
                      {step.id}
                    </span>
                  </div>
                ) : currentStep === index ? (
                  <div
                    className="flex w-full flex-col border-t-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                    aria-current="step"
                  >
                    <span className="text-sm font-medium text-prborder-primary">
                      {step.id}
                    </span>
                  </div>
                ) : (
                  <div className="group flex w-full flex-col border-t-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-gray-500 transition-colors">
                      {step.id}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <form className="w-full mt-8" onSubmit={handleSubmit(processForm)}>
          {renderStep()}

          <div className="mt-8 flex justify-between">
            {currentStep > 0 && currentStep < steps.length - 1 && (
              <Button
                type="button"
                onClick={prev}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Back
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button
                type="button"
                onClick={next}
                className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-background hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoadingSpinner text="Loading..." />
                ) : currentStep === steps.length - 2 ? (
                  <span className="px-4">Finish</span>
                ) : (
                  <ArrowRight />
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
