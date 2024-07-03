import { useState } from 'react';
import { AnyObject } from 'yup';

export const useAdminUserErrors = () => {
	interface IAdminUserErrors {
		backend: [];
		email: '';
		password: '';
		mobile: '';
		firstName: '';
		lastName: '';
	}

	const initialAdminUserErrors: IAdminUserErrors = {
		backend: [],
		email: '',
		password: '',
		mobile: '',
		firstName: '',
		lastName: ''
	};

	const [adminUserErrors, setCurrentAdminUserErrors] = useState<IAdminUserErrors>({
		backend: [],
		email: '',
		password: '',
		mobile: '',
		firstName: '',
		lastName: ''
	});

	const setAdminUserErrors = (action: setAdminUserErrorActions, payload?: AnyObject) => {
		switch (action) {
			case setAdminUserErrorActions.SET_VALIDATION_ERROR_MESSAGES:
				if (payload?.validationErrors !== undefined) {
					setCurrentAdminUserErrors((prevState) => ({
						...prevState,
						email: payload.validationErrors.email !== undefined ? payload.validationErrors.email[0] : '',
						mobile:
							payload.validationErrors.mobile !== undefined
								? payload.validationErrors.mobile[0]
								: payload.validationErrors.isMobileValid !== undefined
								? payload.validationErrors.isMobileValid[0]
								: '',
						firstName: payload.validationErrors.firstName !== undefined ? payload.validationErrors.firstName[0] : '',
						lastName: payload.validationErrors.lastName !== undefined ? payload.validationErrors.lastName[0] : '',
						password: payload.validationErrors.password !== undefined ? payload.validationErrors.password[0] : ''
					}));
				}
				break;
			case setAdminUserErrorActions.SET_RESPONSE_ERROR_MESSAGES:
				if (payload?.responseErrorMessages !== undefined) {
					setCurrentAdminUserErrors({
						backend: payload.responseErrorMessages.backend,
						email: payload.responseErrorMessages.email,
						mobile: payload.responseErrorMessages.mobile,
						firstName: payload.responseErrorMessages.firstName,
						lastName: payload.responseErrorMessages.lastName,
						password: payload.responseErrorMessages.password
					});
				}
				break;
			case setAdminUserErrorActions.RESET:
				setCurrentAdminUserErrors(initialAdminUserErrors);
				break;
			default:
				break;
		}
	};

	return { adminUserErrors, setAdminUserErrors };
};

export enum setAdminUserErrorActions {
	SET_VALIDATION_ERROR_MESSAGES = 'SET_VALIDATION_ERROR_MESSAGES',
	SET_RESPONSE_ERROR_MESSAGES = 'SET_RESPONSE_ERROR_MESSAGES',
	RESET = 'RESET'
}
