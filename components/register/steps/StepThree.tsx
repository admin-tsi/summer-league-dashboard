import { motion } from "framer-motion";
import { Checkbox } from "../../ui/checkbox";
import { userRole } from "@/constants/user/user";
import { CustomSelect } from "../../players/edit/custom-select";
import { StepThreeProps } from "@/types/register/registerTypes";

export const StepThree = ({
  form,
  delta,
  isTermsAccepted,
  setIsTermsAccepted,
  termsError,
}: StepThreeProps) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const userFunctionOptions = userRole.map((functions) => ({
    id: functions.id,
    value: functions.role,
    label: `${functions.role}`,
  }));

  return (
    <motion.div
      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Tell us more about you
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Share some additional details about yourself. This helps us tailor your
        experience and provide better support.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4">
        <div className="sm:col-span-3">
          <label
            htmlFor="profession"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            What do you do for a living ? (Profession)
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="profession"
              {...register("profession")}
              autoComplete="profession"
              placeholder="e.g., Web Developer, Teacher, etc."
              className="block w-full rounded-md border-[1px] py-1.5 text-gray-900 shadow-sm bg-background placeholder:text-gray-400 sm:text-sm sm:leading-6 focus-visible:outline-none"
            />
            {errors.profession?.message && (
              <p className="mt-2 text-sm text-red-400">
                {errors.profession.message}
              </p>
            )}
          </div>
        </div>
        <div className="sm:col-span-3">
          <CustomSelect
            label="What is your role in the summer league ?"
            placeholder="Select your role"
            options={userFunctionOptions}
            value={watch("specialization")}
            onValueChange={(value) => setValue("specialization", value)}
            error={errors.specialization?.message}
          />
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
                I authorize SUMMER League to use my personal information to send
                me messages and advertisements about products and initiatives
                from SUMMER League and its partners.
              </p>
            </div>
          </div>
          {termsError && (
            <p className="mt-2 text-sm text-red-400 px-2">
              You must accept the terms in order to create your account and
              access the platform.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
