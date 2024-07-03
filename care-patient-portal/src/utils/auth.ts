import Cookies from 'js-cookie';
import { env } from './env';

export const VITE_DEFAULT_PHONE_NUMBER_COUNTRY = env.VITE_DEFAULT_PHONE_NUMBER_COUNTRY
export const VITE_DEFAULT_COUNTRY = env.VITE_DEFAULT_COUNTRY

export const isAuth = () => {
	const token = Cookies.get('PATIENT_token');
	const userId = Cookies.get('PATIENT_userId');
	return !!(token && userId);
};

export const logout = () => {
	const options = { domain: env.VITE_DOMAIN, path: '/' };
	Cookies.remove('PATIENT_token', options);
	Cookies.remove('PATIENT_userId', options);
	Cookies.remove('profilePhoto',options)
	window.location.replace(env.VITE_LOGIN_URL);
};

export const getAuthenticatedUser = () => {
	const user = {
		token: Cookies.get('PATIENT_token'),
		userId: Cookies.get('PATIENT_userId'),
	};
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${user.token}`,
	};

	return { ...user, headers };
};
