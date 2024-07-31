import { Input } from "@/components/ui/input";
import React from "react";

interface InputProps {
  id?: string;
  label?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  required?: boolean;
  placeholder?: string;
}

const Editinput: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  errorMessage,
  required = false,
  placeholder,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`px-4 py-2 border rounded-md focus-visible:outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          errorMessage ? "border-red-500" : "border-black"
        }`}
        required={required}
      />
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default Editinput;
