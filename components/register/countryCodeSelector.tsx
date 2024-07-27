import React, { useState, useEffect } from "react";
import axios from "axios";
import { UseFormRegisterReturn } from "react-hook-form";

interface Country {
  name: {
    common: string;
  };
  cca2: string;
  idd: {
    root: string;
    suffixes?: string[];
  };
  flags: {
    svg: string;
  };
}

interface CountryCodeSelectorProps {
  onChange: (code: string) => void;
  value: string;
  register: UseFormRegisterReturn;
}

const CountryCodeSelector: React.FC<CountryCodeSelectorProps> = ({
  onChange,
  value,
  register,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countryData: Country[] = response.data.map((country: any) => ({
          name: country.name.common,
          cca2: country.cca2,
          idd: country.idd,
          flags: country.flags,
        }));
        setCountries(countryData);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className="flex flex-col">
      <label
        htmlFor="countryCode"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Country Code
      </label>
      <select
        id="countryCode"
        value={value}
        {...register}
        className="bg-background w-[150px] focus-visible:outline-none rounded-md mt-1 text-sm outline-none"
      >
        <option value="">Select a country</option>
        {countries.map((country) => {
          const code = country.idd.suffixes
            ? country.idd.root + country.idd.suffixes[0]
            : country.idd.root;
          return (
            <option key={country.cca2} value={code} className="text-sm">
              ({code}) {country.name.common}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default CountryCodeSelector;
