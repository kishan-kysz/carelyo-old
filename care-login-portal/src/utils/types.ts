export interface IRegisterReq {
  email: string
  mobile: string
  referralCode: string
  consent: boolean
  sso: boolean
}

export interface ILoginReq {
  email: string
  password: string
}
export interface IForgotPassword {
  email: string
}
export type Roles = 'PATIENT' | 'DOCTOR' | 'SYSTEMADMIN'
export interface ILoginRes {
  id: number
  userId: number
  email: string
  mobile: string
  role: Roles[]
  token: string
  profilePhoto: string
}

export interface INewPassword {
  email: string
  password: string
  token: string
  confirmPassword: string
}

export interface SSOLogin {
  access_token: string
}
