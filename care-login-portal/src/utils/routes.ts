export const API_URL = import.meta.env.VITE_API_URL
export const PATIENTURL = import.meta.env.VITE_PATIENT_URL
export const DOCTORURL = import.meta.env.VITE_DOCTOR_URL
export const SYSADMIN = import.meta.env.VITE_SYSADMIN_URL
export const DOMAIN = import.meta.env.VITE_DOMAIN
export const PHARMACISTURL = import.meta.env.VITE_PHARMACYUSER_URL
export const PHARMACYURL = import.meta.env.VITE_PHARMACYADMIN_URL
export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
export const CLIENT_PASSWORD = import.meta.env.VITE_CLIENT_PASSWORD
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
export const ROUTES = {
  login: '/api/v1/auth/login',
  ssoLogin: '/api/v1/auth/sso/GOOGLE/login',
  registerPatient: '/api/v1/auth/register/patient',
  registerHospital: '/api/v1/auth/register/hospital',
  registerPharmacy: '/api/v1/auth/register/pharmacy',
  registerLaboratory: '/api/v1/auth/register/labadmin',
  registerDoctor: '/api/v1/auth/register/doctor',
  forgotPassword: '/api/v1/auth/forgot-password',
  resetPassword: '/api/v1/auth/reset-password'
}
