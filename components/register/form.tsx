"use client";

import { submitForm } from "@/lib/api/auth/register";
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "../ui/checkbox";
import LoadingSpinner from "../loading-spinner";
import Link from "next/link";
import logo from "@/public/logo.svg";
import Image from "next/image";
import Confetti, { ConfettiRef } from "../magicui/confetti";

type Inputs = z.infer<typeof RegisterSchema>;

const steps = [
  {
    id: "Step 1",
    name: "Personal Information",
    fields: ["email", "password"],
  },
  {
    id: "Step 2",
    name: "Address",
    fields: ["firstName", "lastName", "countryCode", "phoneNumber", "address"],
  },
  {
    id: "Step 3",
    name: "Tell us more about you",
    fields: ["specialization", "dateOfBirth"],
  },
  {
    id: "Step 4",
    name: "Complete",
  },
];

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const confettiRef = useRef<ConfettiRef>(null);
  const delta = currentStep - previousStep;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(RegisterSchema),
  });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await submitForm(data);
      setFormError(null);
      console.log(response);
      localStorage.removeItem("formData");
    } catch (error: any) {
      console.error(error);
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

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

  return (
    <>
      <div className="w-full h-full overflow-y-scroll md:h-fit md:w-[500px] p-5 rounded-lg bg-muted shadow">
        <nav aria-label="Progress" className="flex flex-col space-y-10">
          <div className="w-full flex justify-center items-center">
            <Image src={logo} alt="AWSP Logo" width={72} height={50} />
          </div>
          <ol
            role="list"
            className=" flex w-full space-x-2 md:space-x-8 md:space-y-0"
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
          {currentStep === 0 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h2 className="text-base font-semibold leading-7 text-primary">
                Login details
              </h2>
              <p className="text-sm mt-2 leading-6 text-gray-600">
                At this stage, you need to provide your login email and
                password. Make sure to enter information you know well so you
                can access the platform.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-4">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="email"
                      {...register("email")}
                      autoComplete="email"
                      placeholder="johndoe@gmail.com"
                      className="block w-full rounded-md border-[1px] py-1.5 text-gray-900 shadow-sm bg-background placeholder:text-gray-400 sm:text-sm sm:leading-6 focus-visible:outline-none"
                    />
                    {errors.email?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="relative mt-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      {...register("password")}
                      autoComplete="password"
                      placeholder="********"
                      className="block w-full px-2 rounded-md border-[1px] placeholder:px-2 py-1.5 text-gray-900 shadow-sm bg-background placeholder:text-gray-400 sm:text-sm sm:leading-6 focus-visible:outline-none"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute top-3 right-2 text-gray-400"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    {errors.password?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Personal Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Please provide your personal information below. This includes
                details such as your full name, address, and contact
                information.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4">
                <div className="w-full">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    First Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="firstName"
                      {...register("firstName")}
                      placeholder="John"
                      className="block w-full rounded-md border-[1px] py-1.5 text-gray-900 shadow-sm bg-background placeholder:text-gray-400 sm:text-sm sm:leading-6 focus-visible:outline-none"
                    />
                    {errors.firstName?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Last Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="lastName"
                      {...register("lastName")}
                      placeholder="Doe"
                      className="block w-full rounded-md border-[1px] py-1.5 text-gray-900 shadow-sm bg-background placeholder:text-gray-400 sm:text-sm sm:leading-6 focus-visible:outline-none"
                    />
                    {errors.lastName?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="w-full">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label
                        htmlFor="countryCode"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Country Code
                      </label>
                      <input
                        type="text"
                        id="countryCode"
                        {...register("countryCode")}
                        autoComplete="countryCode"
                        placeholder="+229"
                        className="block w-full rounded-md border-[1px] py-1.5 text-gray-900 shadow-sm bg-background placeholder:text-gray-400 sm:text-sm sm:leading-6 focus-visible:outline-none"
                      />
                      {errors.countryCode?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.countryCode.message}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Phone number
                      </label>
                      <div className="">
                        <input
                          type="text"
                          id="phoneNumber"
                          {...register("phoneNumber")}
                          autoComplete="phoneNumber"
                          placeholder="96000000"
                          className="block w-full rounded-md border-[1px] py-1.5 text-gray-900 shadow-sm bg-background placeholder:text-gray-400 sm:text-sm sm:leading-6 focus-visible:outline-none"
                        />
                        {errors.phoneNumber?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.phoneNumber.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Address
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="address"
                      {...register("address")}
                      autoComplete="address"
                      placeholder="Cotonou, Bénin"
                      className="block w-full rounded-md border-[1px] py-1.5 text-gray-900 shadow-sm bg-background placeholder:text-gray-400 sm:text-sm sm:leading-6 focus-visible:outline-none"
                    />
                    {errors.address?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Tell us more about you
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Share some additional details about yourself. This helps us
                tailor your experience and provide better support.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="specialization"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Specialization
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="specialization"
                      {...register("specialization")}
                      placeholder="Specialization"
                      className="block w-full rounded-md border-[1px] py-1.5 text-gray-900 shadow-sm bg-background placeholder:text-gray-400 sm:text-sm sm:leading-6 focus-visible:outline-none"
                    />
                    {errors.specialization?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.specialization.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Date of Birth
                  </label>
                  <div className="mt-2">
                    <input
                      type="date"
                      id="dateOfBirth"
                      {...register("dateOfBirth")}
                      className="block w-full rounded-md border-[1px] py-1.5 text-gray-900 shadow-sm bg-background placeholder:text-gray-400 sm:text-sm sm:leading-6 focus-visible:outline-none"
                    />
                    {errors.dateOfBirth?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <div className="items-top flex space-x-2 mt-4">
                    <Checkbox
                      id="terms1"
                      onClick={() => setIsTermsAccepted(!isTermsAccepted)}
                      checked={isTermsAccepted}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms1"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Accept terms and conditions
                      </label>
                      <p className="text-sm text-muted-foreground">
                        I authorize SUMMER League to use my personal information
                        to send me messages and advertisements about products
                        and initiatives from SUMMER League and its partners.
                      </p>
                    </div>
                  </div>
                  {termsError && (
                    <p className="mt-2 text-sm text-red-400 px-2">
                      You must accept the terms in order to create your account
                      and access the platform.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === steps.length - 1 && (
            <div className="w-full max-md:h-full flex flex-col justify-center items-center">
              {formError ? (
                <>
                  <h2 className="text-base font-semibold leading-7 text-red-900">
                    Oups !!!!
                  </h2>
                  <p className="mt-1 px-4 text-center text-sm leading-6 text-gray-600">
                    {`${formError}. Please try again to register your account to start managing your account. If the problem persists, don't hesitate to contact us for help or try again later.`}
                  </p>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="inline-flex my-5 items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Try Again
                  </button>
                </>
              ) : (
                <>
                  <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-6xl md:text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
                    Complete
                  </span>
                  <p className="my-6 px-4 text-center text-sm leading-6 text-gray-600">
                    Thank you for your submission. You can now log in with your
                    credentials to begin managing your team.
                  </p>
                  <Confetti
                    ref={confettiRef}
                    className="absolute left-0 top-0 z-0 size-full"
                    onMouseEnter={() => {
                      confettiRef.current?.fire({});
                    }}
                  />
                  <Link
                    href="/login"
                    className="inline-flex z-50 my-5 items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Log in
                  </Link>
                </>
              )}
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {currentStep > 0 && currentStep < steps.length - 1 && (
              <button
                type="button"
                onClick={prev}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Back
              </button>
            )}
            {currentStep < steps.length - 1 && (
              <button
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
