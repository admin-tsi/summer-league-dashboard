import { motion } from "framer-motion";
import { countryCodes } from "@/constants/data/country-codes";
import { CustomSelect } from "../../players/edit/custom-select";
import { StepProps } from "@/types/register/registerTypes";

export const StepTwo = ({ form, delta }: StepProps) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const countryCodeOptions = countryCodes.map((country) => ({
    id: country.id,
    value: country.code,
    label: `${country.emoji} ${country.country} (${country.code})`,
  }));

  return (
    <motion.div
      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Personal Information
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Please provide your personal information below. This includes details
        such as your full name, address, and contact information.
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
          <CustomSelect
            label="Country Code"
            placeholder="Select country code"
            options={countryCodeOptions}
            value={watch("countryCode")}
            onValueChange={(value) => setValue("countryCode", value)}
            error={errors.countryCode?.message}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="phoneNumber"
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
              className="block w-full rounded-md border-[1px] h-10 text-gray-900 shadow-sm bg-background placeholder:text-gray-400 sm:text-sm sm:leading-6 focus-visible:outline-none"
            />
            {errors.phoneNumber?.message && (
              <p className="mt-2 text-sm text-red-400">
                {errors.phoneNumber.message}
              </p>
            )}
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
  );
};
