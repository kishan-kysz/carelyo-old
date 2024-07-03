export const IS_PROD = process.env.NODE_ENV === 'production'
export const IS_LOCAL = process.env.NODE_ENV === 'development'
export const LOGIN_URL =
  process.env.NEXT_PUBLIC_LOGIN_URL || 'http://localhost:3122'

export const BASEURL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
export const SHOW_LOGGER = IS_LOCAL
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true' ?? false
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH
export const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN
export const acceptConsultations = IS_LOCAL
  ? process.env.NEXT_PUBLIC_ACCEPT_CONSULTATIONS === 'true'
  : true
export const DEMO_NOTIFICATION =
  process.env.NEXT_PUBLIC_DEMO_NOTIFICATION === 'true'

// New environment variable for SameSite attribute of cookies
export const COOKIE_SAMESITE = process.env.COOKIE_SAMESITE || 'None'
