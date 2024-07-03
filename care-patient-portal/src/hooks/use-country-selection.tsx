import { useState } from 'react';
import { countries, countryList } from '../constants/country-states';
import {
	LANGUAGES_ANGOLA,
	LANGUAGES_GHANA,
	LANGUAGES_NAMIBIA,
	LANGUAGES_NIGERIA,
	LANGUAGES_RWANDA,
	LANGUAGES_SIERRALEONE,
	LANGUAGES_TANZANIA,
} from '../constants';

export const useCountrySelection = () => {
	const [selectedCountry, setSelectedCountry] = useState<countries | null>(
		null
	);
	const [selectedState, setSelectedState] = useState<string | null>(null);
	const [selectedCity, setSelectedCity] = useState<string | null>(null);
	const availableCountries = Object.keys(countryList).map((country) => ({
		label: country,
		value: country,
	}));
	const activeCountryStates = () => {
		if (!selectedCountry) {
			return [];
		}
		return countryList[selectedCountry].flatMap((state) => {
			return Object.keys(state).map((key) => ({ label: key, value: key }));
		});
	};
	const activeStateCities = () => {
		if (!(selectedCountry && selectedState)) {
			return [];
		}
		return countryList[selectedCountry][0][selectedState].map((city) => ({
			label: city,
			value: city,
		}));
	};

	const handleCountrySelect = (country: countries) => {
		setSelectedCountry(country);
		setSelectedState(null);
		setSelectedCity(null);
	};

	const handleStateSelect = (state: string) => {
		setSelectedState(state);
		setSelectedCity(null);
	};

	const handleCitySelect = (city: string) => {
		setSelectedCity(city);
	};
	const selectLanguage = () => {
		switch (selectedCountry) {
			case 'Nigeria':
				return LANGUAGES_NIGERIA;
			case 'Tanzania':
				return LANGUAGES_TANZANIA;
			case 'Rwanda':
				return LANGUAGES_RWANDA;
			case 'Ghana':
				return LANGUAGES_GHANA;
			case 'Namibia':
				return LANGUAGES_NAMIBIA;
			case 'Angola':
				return LANGUAGES_ANGOLA;
			case 'Sierra Leone':
				return LANGUAGES_SIERRALEONE;

			default:
				return [];
		}
	};

	return {
		availableCountries,
		activeCountryStates: activeCountryStates(),
		activeStateCities: activeStateCities(),
		languages: selectLanguage(),
		selectedCountry,
		selectedState,
		selectedCity,
		handleCountrySelect,
		handleStateSelect,
		handleCitySelect,
	};
};
