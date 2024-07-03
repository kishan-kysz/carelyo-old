import Cookies from 'js-cookie'
import { DOMAIN, IS_PROD, LOGIN_URL } from './env'

/**
 * @type string
 * @returns current domain
 */
const COOKIES_DOMAIN: string = IS_PROD ? DOMAIN : 'localhost'

/**
 * It removes the cookies from the browser and redirects the user to the login page.
 * @returns The return value is the result of the window.location.replace() method.
 */
export const logout = () => {
  const options = { domain: COOKIES_DOMAIN, path: '/' }
  Cookies.remove('DOCTOR_token', options)
  Cookies.remove('DOCTOR_userId', options)
  return window.location.replace(LOGIN_URL)
}

/**
 * It gets the user's id, token, and userId from the cookies, and then returns the user's data and the
 * options for the headers.
 * @returns An object with two properties: data and options.
 */
export const getAuthenticatedUser = () => {
  const user = {
    token: Cookies.get('DOCTOR_token'),
    userId: Cookies.get('DOCTOR_userId'),
  }
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${user.token}`,
  }

  return { ...user, headers }
}

export const getSession = () => {
  return {
    token: Cookies.get('DOCTOR_token'),
    userId: Cookies.get('DOCTOR_userId'),
  }
}

export const removeSession = () => {
  const options = { domain: COOKIES_DOMAIN, path: '/' }
  Cookies.remove('DOCTOR_token', options)
  Cookies.remove('DOCTOR_userId', options)
  Cookies.remove('DOCTOR_id', options)
}
