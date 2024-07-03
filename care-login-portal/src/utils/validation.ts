import z, { boolean } from 'zod'

export const email = z
  .string()
  .email('Please enter a valid email address')
  .transform((str) => str.toLowerCase().trim())

export const password = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(42, 'Password must be at most 42 characters long')
  .transform((str) => str.trim())

export const consent = z.boolean()

export const mobile = z.string()

export const Signin = z.object({ email, password })
export const Signup = z.object({
  email,
  mobile,
  referralCode: z.string(),
  consent: z.boolean()
})
export const ForgotPasswordSchema = z.object({
  email
})
export const ResetPassword = z
  .object({
    email,
    token: z.string(),
    password: password,
    confirmPassword: password
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'] // set the path of the error
  })
