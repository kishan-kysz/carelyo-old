import { useState } from 'react';
import { AnyObject } from 'yup';
import * as Yup from 'yup';
export const useProviderValues = () => {
	interface IProviderValues {
		email: string;
		providerName: string;
		phoneNumber: string;
		address: string;
		practiceNumber: string;
		secondaryEmail: string;
		webPageUrl: string;
		isMobileValid: boolean;
		country: string;
		currency: string;
		logoURL: string;
		providerType: string;
	}

	const [initialValues, setInitialProviderValues] = useState<IProviderValues>({
		email: '',
		providerName: '',
		phoneNumber: '',
		address: '',
		practiceNumber: '',
		secondaryEmail: '',
		webPageUrl: '',
		isMobileValid: false,
		country: '',
		currency: '',
		logoURL: '',
		providerType: ''
	});

	const [providerValues, setCurrentProviderValues] = useState<IProviderValues>({
		email: '',
		providerName: '',
		phoneNumber: '',
		address: '',
		practiceNumber: '',
		secondaryEmail: '',
		webPageUrl: '',
		isMobileValid: false,
		country: '',
		currency: '',
		logoURL: '',
		providerType: ''
	});

	const setProviderValues = (action: setProviderValueActions, payload?: AnyObject) => {
		switch (action) {
			case setProviderValueActions.SET_PROVIDER_NAME:
				if (payload?.providerName !== undefined) {
					setCurrentProviderValues((prevState) => ({
						...prevState,
						providerName: payload.providerName
					}));
				}
				break;
			case setProviderValueActions.SET_PHONE_NUMBER:
				if (payload?.phoneNumber !== undefined) {
					setCurrentProviderValues((prevState) => ({
						...prevState,
						phoneNumber: payload.phoneNumber
					}));
				}
				break;
		/* 	case setProviderValueActions.SET_IS_PHONE_VALID:
				if (payload?.isMobileValid !== undefined) {
					setCurrentProviderValues((prevState) => ({
						...prevState,
						isMobileValid: payload.isMobileValid
					}));
				}
				break; */
			case setProviderValueActions.SET_ADDRESS:
				if (payload?.address !== undefined) {
					setCurrentProviderValues((prevState) => ({
						...prevState,
						address: payload.address
					}));
				}
				break;
			case setProviderValueActions.SET_PRACTICE_NUMBER:
				if (payload?.practiceNumber !== undefined) {
					setCurrentProviderValues((prevState) => ({
						...prevState,
						practiceNumber: payload.practiceNumber
					}));
				}
				break;
			case setProviderValueActions.SET_PROVIDER_EMAIL:
				if (payload?.email !== undefined) {
					setCurrentProviderValues((prevState) => ({
						...prevState,
						email: payload.email
					}));
				}
				break;
			case setProviderValueActions.SET_SECONDARY_EMAIL:
				if (payload?.secondaryEmail !== undefined) {
					setCurrentProviderValues((prevState) => ({
						...prevState,
						secondaryEmail: payload.secondaryEmail
					}));
				}
				break;
			case setProviderValueActions.SET_WEB_PAGE_URL:
				if (payload?.webPageUrl !== undefined) {
					setCurrentProviderValues((prevState) => ({
						...prevState,
						webPageUrl: payload.webPageUrl
					}));
				}
				break;
			case setProviderValueActions.SET_COUNTRY:
				if (payload?.country !== undefined) {
					setCurrentProviderValues((prevState) => ({
						...prevState,
						country: payload.country,
						currency: ''
					}));
				}
				break;
			case setProviderValueActions.SET_CURRENCY:
				if (payload?.currency !== undefined) {
					setCurrentProviderValues((prevState) => ({
						...prevState,
						currency: payload.currency
					}));
				}
				break;
			case setProviderValueActions.SET_LOGOURL:
				if (payload?.logoURL !== undefined) {
					setCurrentProviderValues((prevState) => ({
						...prevState,
						logoURL: payload.logoURL
					}));
				}
				break;
			case setProviderValueActions.SET_PROVIDER_TYPE:
				if (payload?.providerType !== undefined) {
					setCurrentProviderValues((prevState) => ({
						...prevState,
						providerType: payload.providerType
					}));
				}
				break;

			case setProviderValueActions.INIT:
				if (payload?.provider !== undefined) {
					setInitialProviderValues((prevState) => ({
						...prevState,
						email: payload.provider.email !== undefined ? payload.provider.email : '',
						providerName: payload.provider.providerName !== undefined ? payload.provider.providerName : '',
						address: payload.provider.address !== undefined ? payload.provider.address : '',
						practiceNumber: payload.provider.practiceNumber !== undefined ? payload.provider.practiceNumber : '',
						secondaryEmail: payload.provider.secondaryEmail !== undefined ? payload.provider.secondaryEmail : '',
						phoneNumber: payload.provider.phoneNumber !== undefined ? payload.provider.phoneNumber : '',
						webPageUrl: payload.provider.webPageUrl !== undefined ? payload.provider.webPageUrl : '',
						country: payload.provider.country !== undefined ? payload.provider.country : '',
						currency: payload.provider.currency !== undefined ? payload.provider.currency : '',
						logoURL: payload.provider.logoURL !== undefined ? payload.provider.logoURL : '',
						providerType: payload.provider.providerType !== undefined ? payload.provider.providerType : ''
					}));
					setCurrentProviderValues((prevState) => ({
						...prevState,
						email: payload.provider.email !== undefined ? payload.provider.email : '',
						providerName: payload.provider.providerName !== undefined ? payload.provider.providerName : '',
						phoneNumber: payload.provider.phoneNumber !== undefined ? payload.provider.phoneNumber : '',
						address: payload.provider.address !== undefined ? payload.provider.address : '',
						practiceNumber: payload.provider.practiceNumber !== undefined ? payload.provider.practiceNumber : '',
						secondaryEmail: payload.provider.secondaryEmail !== undefined ? payload.provider.secondaryEmail : '',
						webPageUrl: payload.provider.webPageUrl !== undefined ? payload.provider.webPageUrl : '',
						country: payload.provider.country !== undefined ? payload.provider.country : '',
						currency: payload.provider.currency !== undefined ? payload.provider.currency : '',
						logoURL: payload.provider.logoURL !== undefined ? payload.provider.logoURL : '',
						providerType: payload.provider.providerType !== undefined ? payload.provider.providerType : ''
					}));
				}
				break;
			case setProviderValueActions.RESET:
				setCurrentProviderValues(initialValues);
				break;
			default:
				break;
		}
	};

	return { setProviderValues, providerValues };
};

export enum setProviderValueActions {
	SET_PROVIDER_EMAIL = 'SET_PROVIDER_EMAIL',
	SET_PROVIDER_NAME = 'SET_PROVIDER_NAME',
	SET_PHONE_NUMBER = 'SET_PHONE_NUMBER',
	SET_IS_PHONE_VALID = 'SET_IS_PHONE_VALID',
	SET_ADDRESS = 'SET_ADDRESS',
	SET_PRACTICE_NUMBER = 'SET_PRACTICE_NUMBER',
	SET_SECONDARY_EMAIL = 'SET_SECONDARY_EMAIL',
	SET_WEB_PAGE_URL = 'SET_WEB_PAGE_URL',
	SET_COUNTRY = 'SET_COUNTRY',
	SET_CURRENCY = 'SET_CURRENCY',
	SET_LOGOURL = 'SET_LOGOURL',
	SET_PROVIDER_TYPE = 'SET_PROVIDER_TYPE',
	INIT = 'INIT',
	RESET = 'RESET'
}
