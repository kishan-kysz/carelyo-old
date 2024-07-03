import { useState } from 'react';
import { AnyObject } from 'yup';
import * as Yup from 'yup';
export const useProviderErrors = () => {
	interface IProviderErrors {
		backend: string[];
		email: string;
		providerName: string;
		phoneNumber: string;
		address: string;
		practiceNumber: string;
		secondaryEmail: string;
		webPageUrl: string;
		logoURL: string;
		logoFilePath: string;
		bucketName: string;
		country: string;
		currency: string;
		providerType: string;
	}

	const initialProviderErrors: IProviderErrors = {
		backend: [],
		email: '',
		providerName: '',
		phoneNumber: '',
		address: '',
		practiceNumber: '',
		secondaryEmail: '',
		webPageUrl: '',
		logoURL: '',
		logoFilePath: '',
		bucketName: '',
		country: '',
		currency: '',
		providerType: ''
	};

	const [providerErrors, setCurrentProviderErrors] = useState<IProviderErrors>({
		backend: [],
		email: '',
		providerName: '',
		phoneNumber: '',
		address: '',
		practiceNumber: '',
		secondaryEmail: '',
		webPageUrl: '',
		logoURL: '',
		logoFilePath: '',
		bucketName: '',
		country: '',
		currency: '',
		providerType: ''
	});

	const setProviderErrors = (action: setProviderErrorActions, payload?: AnyObject) => {
		switch (action) {
			case setProviderErrorActions.SET_VALIDATION_ERROR_MESSAGES:
				if (payload?.validationErrors !== undefined) {
					setCurrentProviderErrors((prevState) => ({
						...prevState,
						email: payload.validationErrors.email !== undefined ? payload.validationErrors.email[0] : '',
						phoneNumber:
							payload.validationErrors.phoneNumber !== undefined
								? payload.validationErrors.phoneNumber[0]
								: payload.validationErrors.isMobileValid !== undefined
								? payload.validationErrors.isMobileValid[0]
								: '',
						providerName:
							payload.validationErrors.providerName !== undefined ? payload.validationErrors.providerName[0] : '',
						address: payload.validationErrors.address !== undefined ? payload.validationErrors.address[0] : '',
						practiceNumber:
							payload.validationErrors.practiceNumber !== undefined ? payload.validationErrors.practiceNumber[0] : '',
						secondaryEmail:
							payload.validationErrors.secondaryEmail !== undefined ? payload.validationErrors.secondaryEmail[0] : '',
						webPageUrl: payload.validationErrors.webPageUrl !== undefined ? payload.validationErrors.webPageUrl[0] : '',
						logoURL: payload.validationErrors.logoURL !== undefined ? payload.validationErrors.logoURL[0] : '',
						logoFilePath:
							payload.validationErrors.logoFilePath !== undefined ? payload.validationErrors.logoFilePath[0] : '',
						bucketName: payload.validationErrors.bucketName !== undefined ? payload.validationErrors.bucketName[0] : '',
						country: payload.validationErrors.country !== undefined ? payload.validationErrors.country[0] : '',
						currency: payload.validationErrors.currency !== undefined ? payload.validationErrors.currency[0] : '',
						providerType:
							payload.validationErrors.providerType !== undefined ? payload.validationErrors.providerType[0] : ''
					}));
				}
				break;
			case setProviderErrorActions.SET_RESPONSE_ERROR_MESSAGES:
				if (payload?.responseErrorMessages !== undefined) {
					setCurrentProviderErrors({
						backend: payload.responseErrorMessages.backend,
						email: payload.responseErrorMessages.email,
						phoneNumber: payload.responseErrorMessages.phoneNumber,
						providerName: payload.responseErrorMessages.providerName,
						address: payload.responseErrorMessages.address,
						practiceNumber: payload.responseErrorMessages.practiceNumber,
						secondaryEmail: payload.responseErrorMessages.secondaryEmail,
						webPageUrl: payload.responseErrorMessages.webPageUrl,
						logoURL: payload.responseErrorMessages.logoURL,
						logoFilePath: payload.responseErrorMessages.logoFilePath,
						bucketName: payload.responseErrorMessages.bucketName,
						country: payload.responseErrorMessages.country,
						currency: payload.responseErrorMessages.currency,
						providerType: payload.responseErrorMessages.providerType
					});
				}
				break;
			case setProviderErrorActions.RESET:
				setCurrentProviderErrors(initialProviderErrors);
				break;
			default:
				break;
		}
	};

	return { providerErrors, setProviderErrors };
};

export enum setProviderErrorActions {
	SET_VALIDATION_ERROR_MESSAGES = 'SET_VALIDATION_ERROR_MESSAGES',
	SET_RESPONSE_ERROR_MESSAGES = 'SET_RESPONSE_ERROR_MESSAGES',
	RESET = 'RESET'
}
