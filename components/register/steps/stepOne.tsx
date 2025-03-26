import { motion } from "framer-motion";
import { Checkbox } from "../../ui/checkbox";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { StepProps } from "@/types/register/registerTypes";

export const StepOne = ({ form, delta }: StepProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    watch,
    formState: { errors },
  } = form;
  const passwordValue = watch("password");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const passwordChecklist = [
    { label: "At least 8 characters long", regex: /.{8,}/ },
    { label: "Contains at least one lowercase letter", regex: /[a-z]/ },
    { label: "Contains at least one uppercase letter", regex: /[A-Z]/ },
    { label: "Contains at least one number", regex: /[0-9]/ },
    { label: "Contains at least one special character", regex: /[^a-zA-Z0-9]/ },
  ];

  const isConditionMet = (regex: RegExp) => regex.test(passwordValue || "");

  return (
    <motion.div
      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <h2 className="text-base font-semibold leading-7 text-primary">
        Login details
      </h2>
      <p className="text-sm mt-2 leading-6 text-gray-600">
        At this stage, you need to provide your login email and password. Make
        sure to enter information you know well so you can access the platform.
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

            <Button
              type="button"
              variant="ghost"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-400 hover:bg-transparent"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>

            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Password must meet the following criteria :
              </h3>
              <ul className="mt-2 space-y-1">
                {passwordChecklist.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <Checkbox
                      checked={isConditionMet(item.regex)}
                      disabled={true}
                      className="rounded-full"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {errors.password?.message && (
              <p className="mt-2 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
