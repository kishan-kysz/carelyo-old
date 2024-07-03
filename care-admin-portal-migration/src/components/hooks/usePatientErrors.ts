import { useState } from 'react';
import { AnyObject } from 'yup';
export interface IPatientErrors {
	backend: string[];
	email: string;
	mobile: string;
}
export const usePatientErrors = () => {
	const initialPatientErrors: IPatientErrors = {
		backend: [],
		email: '',
		mobile: ''
	};

	const [patientErrors, setCurrentPatientErrors] = useState<IPatientErrors>({
		backend: [],
		email: '',
		mobile: ''
	});

	const setPatientErrors = (action: setPatientErrorActions, payload?: AnyObject) => {
		switch (action) {
			case setPatientErrorActions.SET_VALIDATION_ERROR_MESSAGES:
				if (payload?.validationErrors !== undefined) {
					setCurrentPatientErrors((prevState) => ({
						...prevState,
						email: payload.validationErrors.email !== undefined ? payload.validationErrors.email[0] : '',
						mobile:
							payload.validationErrors.mobile !== undefined
								? payload.validationErrors.mobile[0]
								: payload.validationErrors.isMobileValid !== undefined
								? payload.validationErrors.isMobileValid[0]
								: ''
					}));
				}
				break;
			case setPatientErrorActions.SET_RESPONSE_ERROR_MESSAGES:
				if (payload?.responseErrorMessages !== undefined) {
					setCurrentPatientErrors({
						backend: payload.responseErrorMessages.backend,
						email: payload.responseErrorMessages.email,
						mobile: payload.responseErrorMessages.mobile
					});
				}
				break;
			case setPatientErrorActions.RESET:
				setCurrentPatientErrors(initialPatientErrors);
				break;
			default:
				break;
		}
	};

	return { patientErrors, setPatientErrors };
};

export enum setPatientErrorActions {
	SET_VALIDATION_ERROR_MESSAGES = 'SET_VALIDATION_ERROR_MESSAGES',
	SET_RESPONSE_ERROR_MESSAGES = 'SET_RESPONSE_ERROR_MESSAGES',
	RESET = 'RESET'
}
