import axios from 'axios';
import { apiUrl } from '../api';
import { getAuthenticatedUser } from '../api/auth';
const authenticatedUser = getAuthenticatedUser();
async function apiCall<T>(path: string, method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH', body?: T) {
	const config = {
		url: apiUrl + path,
		method: method,
		data: body,
		headers: authenticatedUser?.headers
	};
	return axios(config);
}

export default apiCall;
