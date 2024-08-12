import { Input } from "@/components/ui/input";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  id?: string;
  label?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  required?: boolean;
  placeholder?: string;
  register?: UseFormRegisterReturn;
}

const EditInput: React.FC<InputProps> = ({
  id,
  label,
  type,
  onChange,
  onBlur,
  errorMessage,
  required = false,
  placeholder,
  register,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <Input
        id={id}
        type={type ? type : "text"}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`px-4 py-2 border rounded-md focus-visible:outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          errorMessage ? "border-red-500" : "border-black"
        }`}
        {...register}
      />
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default EditInput;
