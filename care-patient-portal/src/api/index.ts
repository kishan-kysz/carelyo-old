import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { env } from '../utils/env';
import Cookies from 'js-cookie';

type API_ERROR = { field: string; message: string; code: string };
export type errorType = {
	errors: API_ERROR[];
};

export class TokenExpiredError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'TokenExpiredError';
	}
}

const axiosApi = <D, E extends errorType>(options?: AxiosRequestConfig<D>) => {
	const token = Cookies.get('PATIENT_token');
	const axiosInstance = axios.create({
		baseURL: env.VITE_API_URL,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		...options,
	});
	axiosInstance.interceptors.response.use(
		(response) => {
			return response;
		},
		(error: AxiosError<E>) => {
			if (error?.response?.status === 500) {
				if (error?.response?.data?.errors[0]?.message === 'Access is denied') {
					return Promise.reject(TokenExpiredError);
				}
			}
			return Promise.reject(error);
		}
	);

	return axiosInstance;
};

export default axiosApi;
