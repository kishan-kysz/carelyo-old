import React from "react";
import "react-phone-number-input/style.css";
import Input from "react-phone-number-input/input";
import { CountryCode } from "react-phone-number-input";

// Define a function to map country code string to CountryCode type
const mapCountryCodeToCountryCodeType = (code: string): CountryCode =>
  code as CountryCode;

const PhoneInputMantine = ({
  value,
  setPhoneInputValue,
}: {
  value: string;
  setPhoneInputValue: (phoneInputMobile: string) => void;
}) => {
  // Get the country code from environment variable or default to 'NG'
  const countryCode = process.env.NEXT_PUBLIC_COUNTRY_CODE || "NG";

  return (
    <Input
      withCountryCallingCode
      international
      label={`Mobile (+${countryCode})`}
      style={{
        width: "100%",
        height: "36px",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #d0d4dc",
        outlineColor: "#288ce4",
      }}
      country={mapCountryCodeToCountryCodeType(countryCode)} // Convert string to CountryCode type
      placeholder="Enter your mobile number e.g., +123456789"
      value={value}
      onChange={setPhoneInputValue}
    />
  );
};

export default PhoneInputMantine;
