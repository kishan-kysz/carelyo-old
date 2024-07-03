import {
  CreateFollowUp,
  EditFollowUp,
  FinishConsultation,
  IAcceptedConsultation,
  IAccolade,
  IBanks,
  IBookedConsultation,
  ICalendarEvent,
  IConsultation,
  ICreateInquiryRequest,
  ICreateInquiryResponse,
  IFormValues,
  IGetMessagesByUser,
  IInquiry,
  IInvitation,
  ILabRequest,
  IPatients,
  IPaySlip,
  IPrescription,
  IProfile,
  IProfileUpdate,
  ITests,
  ITotalConsultationTime,
  IVitals,
  IWallet,
  PageAbleRequest,
  PageAbleResponse,
} from '@types'
import axiosApi from './index'

type PageAbleGetInquiries = PageAbleRequest & {
  userId: number
}

const api = axiosApi()
export const createInquiry = async (payload: ICreateInquiryRequest) => {
  const { data } = await api.post<ICreateInquiryResponse>(
    '/api/v1/inquiries/create',
    payload,
  )
  return data
}
export const getInquiries = async (payload: PageAbleGetInquiries) => {
  const { data } = await api.get<PageAbleResponse<IInquiry>>(
    `/api/v1/inquiries/user/${payload.userId}?page=${payload.page}${
      payload.size ? `&size=${payload.size}` : ''
    }`,
  )
  return data
}

export const getProfile = async (id: number) => {
  const res = await api.get(`/api/v1/users/profile/${id}`)
  return res.data as IProfile
}

export const updateProfile = async (data: IProfileUpdate) => {
  const res = await api.put('/api/v1/doctors/profile/update', data)
  return res.data as IProfile
}

export const getBookedConsultations = async () => {
  const res = await api.get('/api/v1/consultations/booked')
  return res.data as IBookedConsultation[]
}

export const getConsultationById = async (id: number) => {
  const res = await api.get(`/api/v1/consultations/${id}`)
  return res.data as IConsultation
}
export const acceptConsultation = async (id: number) => {
  const res = await api.put(`/api/v1/consultations/accept/${id}`, {
    status: 'accepted',
  })
  return res.data as Pick<IConsultation, 'id' | 'roomName'>
}

export const startConsultation = async (id: number) => {
  const res = await api.put(`/api/v1/consultations/start/${id}`, {
    status: 'started',
  })
  return res.data as { message: string }
}

export const finishConsultation = async ({
  id,
  ...rest
}: FinishConsultation) => {
  const res = await api.put(`/api/v1/consultations/complete/${id}`, {
    ...rest,
  })
  return res.data as { message: string }
}

export const cancelConsultation = async (id: number) => {
  const res = await api.put(`/api/v1/consultations/cancel/${id}`, {
    status: 'cancelled',
  })
  return res.data as { message: string }
}

export const getVideoToken = async (id: number) => {
  const res = await api.get(`/api/v1/consultations/video-token/${id}`)
  return res.data as { token: string }
}

export const getAcceptedConsultation = async (id: string) => {
  const res = await api.get(`/api/v1/consultations/accepted/${id}`)
  return res.data as IAcceptedConsultation
}

export const createLabMutation = async (data: {
  consultationId: number
  reason: string
  test: string
}) => {
  const res = await api.post('/api/v1/consultations/labrequest/create', data)
  return res.data as { message: string }
}

export const deleteLabRequest = async ({ id }: { id: number }) => {
  const res = await api.delete(`/api/v1/consultations/labrequest/delete/${id}`)
  return res.data as { message: string }
}

export const editLabRequest = async (data: {
  id: number
  reason: string
  test: string
}) => {
  const res = await api.put('/api/v1/consultations/labrequest/update', data)
  return res.data as { message: string }
}

export const uploadAvatar = async ({
  data,
  setProgress,
}: {
  data: File
  setProgress: (val: number) => void
}) => {
  const formdata = new FormData()
  formdata.append('image', data)
  const res = await api.put('/api/v1/doctors/profile/avatar/upload', formdata, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: function (progressEvent) {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      )
      setProgress(percentCompleted)
    },
  })
  return res.data as { message: string }
}

export const getAccolades = async (id: number) => {
  const res = await api.get(`/api/v1/doctors/profile/accolades/${id}`)
  return res.data as IAccolade[]
}

export const addAccolade = async (data: Omit<IAccolade, 'id'>) => {
  const res = await api.post('/api/v1/doctors/profile/accolade/add', data)
  return res.data as IAccolade
}

export const deleteAccolade = async (id: number) => {
  const res = await api.delete(
    `/api/v1/doctors/profile/accolade/delete/?accoladeId=${id}`,
  )
  return res.data as { message: string }
}

export const editAccolade = async (data: IAccolade) => {
  const res = await api.put('/api/v1/doctors/profile/accolade/update', data)
  return res.data as IAccolade
}

export const createFollowUp = async (data: CreateFollowUp) => {
  const res = await api.post('/api/v1/consultations/followup/create', data)
  return res.data as { message: string }
}

export const deleteFollowUp = async (id: number) => {
  const res = await api.delete(`/api/v1/consultations/followup/delete/${id}`)
  return res.data as { message: string }
}

export const editFollowUp = async (data: EditFollowUp) => {
  const res = await api.put('/api/v1/consultations/followup/update', data)
  return res.data as { message: string }
}

export const getNumberOfFinishedConsultations = async () => {
  const res = await api.get(
    '/api/v1/statistics/consultations/completed?startDate=0&endDate=9999999999',
  )
  return res.data as { finishedConsultation: number }
}

export const getConsultationsAverageDuration = async () => {
  const res = await api.get(
    '/api/v1/statistics/consultations/avg-duration?startDate=0&endDate=9999999999',
  )
  return res.data as { averageDuration: number }
}

export const getRating = async (id: number) => {
  const res = await api.get(`/api/v1/statistics/doctor/${id}/get-rating`)
  return res.data as { rating: number }
}

export const createPrescriptionMutation = async (data: IPrescription) => {
  const res = await api.post('/api/v1/consultations/prescription/create', data)
  return res.data as { message: string }
}

export const deletePrescriptionRequest = async ({ id }: { id: number }) => {
  return { message: id }
}

export const editPrescriptionRequest = async (data: IPrescription) => {
  const res = await api.put(
    `/api/v1/consultations/prescription/update/${data.id}`,
    data,
  )
  return res.data as { message: string }
}

export const getInvitations = async (id: string) => {
  const res = await api.get(`/api/v1/invitations/users/${id}`)
  return res.data as IInvitation[]
}

export const createInvitation = async (data: {
  email: string
  name: string
}) => {
  const res = await api.post('/api/v1/invitations/create', data)
  return res.data as IInvitation
}
export const resendInvitation = async (id: number) => {
  const res = await api.post(`/api/v1/invitations/resend/${id}`)
  return res.data as IInvitation
}

export const deleteInvitation = async (id: number) => {
  const res = await api.delete(`/api/v1/invitations/delete/${id}`)
  return res.data as IInvitation
}

export const createCalendarEvent = async (data: ICalendarEvent) => {
  const res = await api.post('/api/v1/calendar/event/create', data)
  return res.data as ICalendarEvent
}
export const deleteCalendarEvent = async (id: number) => {
  const res = await api.delete(`/api/v1/calendar/event/delete/${id}`)
  return res.data as ICalendarEvent
}
export const editCalendarEvent = async (data: ICalendarEvent) => {
  const res = await api.put(
    `/api/v1/calendar/event/update?entryId=${data.id}`,
    data,
  )
  return res.data as ICalendarEvent
}
export const getCalendarEvents = async () => {
  const res = await api.get('/api/v1/calendar/events')
  return res.data as ICalendarEvent[]
}
export const getCompletedConsultationsById = async (id: number) => {
  const res = await api.get(`/api/v1/consultations/doctors/completed/${id}`)
  return res.data as IConsultation[]
}

export const getTotalConsultationTime = async () => {
  const res = await api.get(
    '/api/v1/admin/metrics/consultations/completed-time/total-per-doctor',
  )
  return res.data as ITotalConsultationTime[]
}

export const getPaySlipById = async (id: number) => {
  const res = await api.get(`/api/v1/payout/get-payslip?${id}`)
  return res.data as IPaySlip[]
}

export const getWallet = async (headers) => {
  const res = await api.get('/api/v1/payout/wallet', { headers })
  return res.data as IWallet
}

export const getAllTests = async () => {
  const res = await api.get('/api/v1/tests/')
  return res.data as ITests[]
}

export const createTest = async (data: {
  category: string
  procedure: string
}) => {
  const res = await api.post('/api/v1/tests/add', data)
  return res.data as ITests
}

export const editTest = async (data: ITests) => {
  const res = await api.post(`/api/v1/tests/update/${data.id}`, data)
  return res.data as ITests
}

export const deleteTest = async (id: number) => {
  const res = await api.delete(`/api/v1/tests/delete/${id}`)
  return res.data as ITests
}

export const getVitals = async (patientId: number) => {
  const response = await api.get(`/api/v1/vitals/${patientId}`)
  return response.data as IVitals
}

export const getChildVitals = async (patientId: number) => {
  const response = await api.get(`/api/v1/vitals/child/${patientId}`)
  return response.data as IVitals
}

export const getMessagesByUser = async (userId: number) => {
  const res = await api.get(`/api/v1/messages/user?userId=${userId}`)
  return res.data as IGetMessagesByUser[]
}

export const setMessageAsRead = async (messageId: number) => {
  const res = await api.put(`/api/v1/messages/read/${messageId}`)
  return res.data
}
export const deleteMessage = async (messageId: number) => {
  const res = await api.delete(`/api/v1/messages/user/delete/${messageId}`)
  return res.data
}

export const getAllBanks = async () => {
  const response = await api.get('/api/v1/payout/banks')
  return response.data as IBanks[]
}

export const createBankDetails = async (requestData: {
  accountNo: string
  bankCode: string
}) => {
  const response = await api.post('/api/v1/payout/bdetails', requestData)
  return response.data
}

export const getAllPatients = async () => {
  const response = await api.get('/api/v1/patients')
  return response.data as IPatients[]
}

export const sendMessageToUser = async (body: IFormValues) => {
  const response = await api.post('/api/v1/messages/create/user', body)
  return response.data
}

export const getLabsForUser = async (id: number) => {
  const response = await api.get(
    `/api/v1/consultations/labrequest/patient/${id}`,
  )
  return response.data as ILabRequest[]
}

export const getPatientPrescriptions = async (patientId: number) => {
  const response = await api.get(
    `/api/v1/consultations/prescriptions/patient/${patientId}`,
  )
  return response.data as IPrescription[]
}
