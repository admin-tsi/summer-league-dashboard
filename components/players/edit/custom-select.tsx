import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Option {
  id: number;
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;
  placeholder: string;
  options: Option[];
  value: string | undefined;
  onValueChange: (value: string) => void;
  error?: string;
}

export function CustomSelect({
  label,
  placeholder,
  options,
  value,
  onValueChange,
  error,
}: CustomSelectProps) {
  const findOptionByValueOrLabel = (searchValue: string) => {
    return options.find(
      (option) =>
        option.value.toLowerCase() === searchValue.toLowerCase() ||
        option.label.toLowerCase() === searchValue.toLowerCase(),
    );
  };

  const handleValueChange = (newValue: string) => {
    const selectedOption = findOptionByValueOrLabel(newValue);
    if (selectedOption) {
      onValueChange(selectedOption.value);
    } else {
      console.warn(`Unable to find option for value: ${newValue}`);
      onValueChange(newValue);
    }
  };

  const currentOption = value ? findOptionByValueOrLabel(value) : null;

  return (
    <div className="w-full flex flex-col space-y-2">
      <Label htmlFor={label} className="text-sm font-medium text-gray-900">
        {label}
      </Label>
      <Select onValueChange={handleValueChange} value={value || ""}>
        <SelectTrigger className="">
          <SelectValue placeholder={placeholder}>
            {currentOption ? currentOption.label : placeholder}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.id} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <span className="text-red-600 text-sm">{error}</span>}
    </div>
  );
}
