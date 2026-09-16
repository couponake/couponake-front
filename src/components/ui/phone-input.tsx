"use client";

import { useLocale } from "next-intl";
import countryNamesAr from "./country-names-ar.json";
import {
  defaultCountries,
  parseCountry,
  usePhoneInput,
  type CountryIso2,
} from "react-international-phone";

const countries = defaultCountries.map(parseCountry);
const countriesByIso = new Map(countries.map((country) => [country.iso2, country]));
// Fixed labels and order avoid ICU-version differences during hydration.
const arabicCountries = Object.entries(countryNamesAr).map(([iso2, name]) => ({
  ...countriesByIso.get(iso2 as CountryIso2)!,
  name,
}));

type PhoneInputProps = {
  id: string;
  value?: string;
  defaultCountry?: CountryIso2;
  className?: string;
  onChange: (phone: string) => void;
};

// Keep the library's international-number handling without rendering flag assets.
export function PhoneInput({
  id,
  value,
  defaultCountry = "eg",
  className = "",
  onChange,
}: PhoneInputProps) {
  const locale = useLocale();
  const isArabic = locale.startsWith("ar");
  const countryOptions = isArabic ? arabicCountries : countries;
  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry,
      value,
      onChange: ({ phone }) => onChange(phone),
    });

  return (
    <div className={`grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 ${className}`}>
      <select
        id={`${id}-country`}
        aria-label={isArabic ? "الدولة وكود الاتصال" : "Country and calling code"}
        value={country.iso2}
        onChange={(event) => setCountry(event.target.value as CountryIso2)}
        className="min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-main-600"
      >
        {countryOptions.map(({ iso2, name, dialCode }) => (
          <option key={iso2} value={iso2}>
            {name} ({`\u2066+${dialCode}\u2069`})
          </option>
        ))}
      </select>
      <input
        id={id}
        name="phone"
        type="tel"
        autoComplete="tel"
        dir="ltr"
        ref={inputRef}
        value={inputValue}
        onChange={handlePhoneValueChange}
        className="min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-gray-100 px-3 text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-main-600"
      />
    </div>
  );
}
