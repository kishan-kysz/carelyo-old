import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { getAuthenticatedUser } from '@utils/auth'
import { BASEURL } from '@utils/env'

type API_ERROR = { field: string; message: string; code: string }
export type errorType = {
  errors: API_ERROR[]
}

export class TokenExpiredError extends Error {
  constructor(message) {
    super(message)
    this.name = 'TokenExpiredError'
  }
}

const axiosApi = <D, E extends errorType>(options?: AxiosRequestConfig<D>) => {
  const { headers } = getAuthenticatedUser()
  const axiosInstance = axios.create({
    baseURL: BASEURL,
    headers,
    ...options,
  })
  axiosInstance.interceptors.response.use(
    (response) => {
      return response
    },
    (error: AxiosError<E>) => {
      if (error.response.status === 500) {
        if (error.response.data.errors[0].message === 'Access is denied') {
          return Promise.reject(TokenExpiredError)
        }
      }
      /* const newError = new Error(JSON.stringify(error.response.data.errors));*/
      return Promise.reject(error)
    },
  )

  return axiosInstance
}

export default axiosApi
