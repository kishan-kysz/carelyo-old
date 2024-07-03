import { useState } from 'react';
import { AnyObject } from 'yup';

export const useAdminUserValues = () => {
	interface IAdminUserValues {
		email: string;
		password: string;
		mobile: string;
		firstName: string;
		lastName: string;
		isMobileValid: boolean;
	}

	const [initialValues, setInitialAdminUserValues] = useState<IAdminUserValues>({
		email: '',
		password: '',
		mobile: '',
		firstName: '',
		lastName: '',
		isMobileValid: false
	});

	const [adminUserValues, setCurrentAdminUserValues] = useState<IAdminUserValues>({
		email: '',
		password: '',
		mobile: '',
		firstName: '',
		lastName: '',
		isMobileValid: false
	});

	const setAdminUserValues = (action: setAdminValueActions, payload?: AnyObject) => {
		switch (action) {
			case setAdminValueActions.SET_EMAIL:
				if (payload?.email !== undefined) {
					setCurrentAdminUserValues((prevState) => ({
						...prevState,
						email: payload.email
					}));
				}
				break;
			case setAdminValueActions.SET_MOBILE:
				if (payload?.mobile !== undefined) {
					setCurrentAdminUserValues((prevState) => ({
						...prevState,
						mobile: payload.mobile
					}));
				}
				break;
		
			
			case setAdminValueActions.SET_FIRST_NAME:
				if (payload?.firstName !== undefined) {
					setCurrentAdminUserValues((prevState) => ({
						...prevState,
						firstName: payload.firstName
					}));
				}
				break;
			case setAdminValueActions.SET_LAST_NAME:
				if (payload?.lastName !== undefined) {
					setCurrentAdminUserValues((prevState) => ({
						...prevState,
						lastName: payload.lastName
					}));
				}
				break;

			case setAdminValueActions.INIT:
				if (payload?.user !== undefined) {
					setInitialAdminUserValues((prevState) => ({
						...prevState,
						email: payload.user?.email,
						mobile: payload.user?.mobile,
						firstName: payload.user?.firstName,
						lastName: payload.user?.lastName
					}));
					setCurrentAdminUserValues((prevState) => ({
						...prevState,
						email: payload.user?.email,
						mobile: payload.user?.mobile,
						firstName: payload.user?.firstName,
						lastName: payload.user?.lastName
					}));
				}
				break;
			case setAdminValueActions.SET_PASSWORD:
				if (payload?.password !== undefined) {
					setCurrentAdminUserValues((prevState) => ({
						...prevState,
						password: payload.password
					}));
				}
				break;

			case setAdminValueActions.RESET:
				setCurrentAdminUserValues(initialValues);
				break;
			default:
				break;
		}
	};

	return { setAdminUserValues, adminUserValues };
};

export enum setAdminValueActions {
	SET_EMAIL = 'SET_EMAIL',
	SET_MOBILE = 'SET_MOBILE',
	SET_FIRST_NAME = 'SET_FIRST_NAME',
	SET_LAST_NAME = 'SET_LAST_NAME',
	SET_PASSWORD = 'SET_PASSWORD',
	SET_IS_MOBILE_VALID = 'SET_IS_PHONE_INPUT_VALID',
	INIT = 'INIT',
	RESET = 'RESET'
}
