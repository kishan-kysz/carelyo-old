import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const loginUrl = process.env.NEXT_PUBLIC_LOGIN_URL;
const domain = process.env.NEXT_PUBLIC_DOMAIN;
export const isAuth = (user: {
    id?: string;
    token?: string;
    userId?: string;
}) => {
    const { id, token, userId } = user;

    if (id && token && userId) {
        const expTime: {
            sub: string;
            iss: string;
            iat: number;
            exp: number;
        } = jwtDecode(token);
        if (Date.now() >= expTime.exp * 1000) {
            return false;
        }
        return true;
    }
    return false;
};

export const logout = () => {
	const options = {
		domain: domain,
		path: '/'
	};
	Cookies.remove('SYSTEMADMIN_token', options);
	Cookies.remove('SYSTEMADMIN_id', options);
	Cookies.remove('SYSTEMADMIN_userId', options);
if (typeof window !== 'undefined') {
    return window.location.replace(loginUrl);
  }
};

export const getAuthenticatedUser = () => {
	const user = {
		id: Cookies.get('SYSTEMADMIN_id'),
		token: Cookies.get('SYSTEMADMIN_token'),
		userId: Cookies.get('SYSTEMADMIN_userId')
	};

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${user.token}`
	};
  if (!isAuth(user)) {
    if (typeof window !== 'undefined') {
      return window.location.replace(loginUrl);
    }
  }

	return { data: user, headers: headers };
};
