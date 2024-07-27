"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { RegisterSchema } from "@/schemas";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import CountryCodeSelector from "./countryCodeSelector";
import { Checkbox } from "../ui/checkbox";

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
];

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
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

  const processForm: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    reset();
  };

  const handleCountryChange = (code: string) => {
    console.log(code);

    setValue("countryCode", code);
  };

  type FieldName = keyof Inputs;

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });

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

  return (
    <section className="w-full h-[100vh] flex justify-center items-center">
      <div className="w-full md:w-[500px] p-5 rounded-lg bg-muted shadow">
        <nav aria-label="Progress">
          <ol
            role="list"
            className="space-y-4 md:flex md:space-x-8 md:space-y-0"
          >
            {steps.map((step, index) => (
              <li key={step.id} className="md:flex-1">
                {currentStep > index ? (
                  <div className="group flex w-full flex-col border-l-4 border-primary py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-prborder-primary transition-colors">
                      {step.id}
                    </span>
                  </div>
                ) : currentStep === index ? (
                  <div
                    className="flex w-full flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                    aria-current="step"
                  >
                    <span className="text-sm font-medium text-prborder-primary">
                      {step.id}
                    </span>
                  </div>
                ) : (
                  <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
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
                information. This data is necessary to complete your profile and
                ensure that we can reach you if needed.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="firstName"
                      {...register("firstName")}
                      autoComplete="firstName"
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
                <div className="sm:col-span-3">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="lastName"
                      {...register("lastName")}
                      autoComplete="lastName"
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
                <div className="col-span-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <CountryCodeSelector
                        value={watch("countryCode") || ""}
                        onChange={handleCountryChange}
                        register={register("countryCode")}
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
                      <div className="mt-1">
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
                <div className="sm:col-span-3">
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
                To complete your account creation on the Summer League platform,
                we’d like to learn a bit more about you! This information will
                help us get to know you better and provide you with a
                personalized and enriching experience.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="specialization"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Profession
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="specialization"
                      {...register("specialization")}
                      autoComplete="specialization"
                      placeholder="sports coach"
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
                    Date of birth
                  </label>
                  <div className="mt-2">
                    <input
                      type="date"
                      id="dateOfBirth"
                      {...register("dateOfBirth")}
                      autoComplete="dateOfBirth"
                      placeholder="Doe"
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
                    <Checkbox id="terms1" className="bg-" />
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
                </div>
              </div>
            </motion.div>
          )}
        </form>

        {/* Navigation */}
        <div className="mt-8 pt-5">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prev}
              disabled={currentStep === 0}
              className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-background hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
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
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-background hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {currentStep === steps.length - 1 ? (
                <span>Terminer</span>
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
          </div>
        </div>
      </div>
    </section>
  );
}
