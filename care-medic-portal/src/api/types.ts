import { z } from 'zod'

type accountType = 'Doctor' | 'Student'
type accountStatus =
  | 'NEEDS_APPROVAL'
  | 'PENDING'
  | 'PROFILE_INCOMPLETE'
  | 'SUSPENDED'
  | 'ACTIVE'
type systemStatus = 'Available' | 'Busy' | 'Offline'

export interface IProfile {
  name: any
  userId: number
  consent: boolean
  systemStatus: systemStatus
  accountStatus: accountStatus
  accountType: accountType
  avatar: string
  firstName: string
  lastName: string
  gender: 'Male' | 'Female' | 'Other'
  rating: number
  dateOfBirth: Date | string
  university: string
  graduationDate: Date | string
  studentIdNumber: number
  nationalIdNumber: number
  city: string
  state: string
  country: string
  street: string
  streetNumber: number
  zipCode: number
  title: string
  hospital: string
  workAddress: string
  workEmail: string
  workMobile: string
  mobile: string
  email: string
  referralCode: string
  referralCount: number
  activeConsultation?: {
    id: number
    status: 'accepted' | 'started'
    patientName: string
    roomName: string
  }
}

export type IProfileUpdate = Omit<
  IProfile,
  | 'systemStatus'
  | 'accountStatus'
  | 'avatar'
  | 'studentIdNumber'
  | 'nationalIdNumber'
  | 'title'
  | 'mobile'
  | 'email'
  | 'accolades'
  | 'referralCode'
  | 'referralCount'
  | 'userId'
  | 'rating'
  | 'activeConsultation'
>

export interface IBookedConsultation {
  id: number
  bodyArea: string[]
  age: string
  gender: string
  timeBooked: string
  status: string
  symptoms: string[]
  relatedSymptoms: string[]
  textDetailedDescription: string
  language: string
  consultationType: string
  patientId: number;
  isChild: boolean;
}

export interface IConsultation {
  id: number
  patientFullName: string
  patientMobileNumber: string
  patientId: number
  doctorFullName: string
  doctorId: number
  bodyArea: string[]
  timeBooked: number
  timeAccepted: number
  timeStarted: string
  timeFinished: string
  status:
    | 'booked'
    | 'accepted'
    | 'started'
    | 'finished'
    | 'incomplete'
    | 'cancelled'
  situation: string
  background: string
  assessment: string
  diagnosis: string
  notes: string
  recommendation: string
  symptoms: string[]
  relatedSymptoms: string[]
  consultationUrl: string
  roomName: string
  textDetailedDescription: string
  audioDetailedDescription: string
  transactionReference: string
  amountPaid: string
  language: string
  doctorNote: string
  duration: number
  consultationType: 'VIRTUAL' | 'PHYSICAL'
  priceListName: string
}

export type ConsultationAccepted = Omit<
  IConsultation,
  | 'patientMobileNumber'
  | 'patientFullName'
  | 'doctorId'
  | 'doctorFullName'
  | 'patientId'
>
export type PatientInfo = Pick<
  IConsultation,
  'patientMobileNumber' | 'patientFullName' | 'patientId'
> & {
  parentName: string
  name: string
  dateOfBirth: string
  patientId: number
  gender: string
  address: string
  community: string
  language: string[]
  bloodType: string
  allergies: string[]
  disabilities: string[]
  medicalProblems: string[]
  height: number
  weight: number,
  isChild: Boolean
}

export interface Doctor {
  name: string
  doctorId: number
}

export interface IPrescription {
  id: number
  issueDate?: Date
  issuerName?: string
  dosage: string
  frequency: string
  illness: string
  quantity: string
  medicationName: string
  medicationType: string
  medicationStrength: string
  treatmentDuration: string
  consultationId?: number
  status: string
}

export interface ILabRequest {
  id: number
  doctorName: string
  patientName: string
  reason: string
  test: string
  createdAt: string
}

export interface IHistory {
  id: number
  doctorName: string
  symptoms: string[]
  relatedSymptoms: string[]
  situation: string[]
  background: string[]
  assessment: string[]
  diagnosis: string
  notes: string[]
  recommendation: string[]
  timeFinished: Date
  prescriptions: IPrescription[]
  labrequests: ILabRequest[]
  followUpId: number

  sbar: {
    situation: string
    background: string
    assessment: string
    diagnosis: string
    notes: string
    recommendation: string
  }
}

export interface IAcceptedConsultation {
  consultation: ConsultationAccepted
  patientInfo: PatientInfo
  doctor: Doctor
  history: IHistory[]
  currentConsultation: {
    labs: ILabRequest[]
    prescriptions: IPrescription[]
    followUp: IFollowUp
  }
  images: string[]
}

export interface ICalendarEvent {
  id?: number
  title: Date
  start: Date
  end: Date
  color: string
  allDay: boolean
  description: string
}

export interface IInvitation {
  id: number
  email: string
  name: string
  invitedByName: string
  invitedById: number
  registrationDate: Date
  createdAt: Date
  status: string
}

export interface Consultation {
  id: number
  timeBooked: number
  timeAccepted: number
  timeStarted: number
  timeFinished: number
  status: string
  symptoms: string[]
  relatedSymptoms: string[]
  consultationUrl: string
  roomName: string
  textDetailedDescription: string
  audioDetailedDescription: string
  transactionReference: string
  amountPaid: string
  language: string
  doctorNote: string
  bodyArea: string[]
}

export interface IAccolade {
  id: number
  doctorId: number
  name: accoladesNames
  description: string
  year: number
}

const accoladesNamesSchema = z.union([
  z.literal('Award'),
  z.literal('Certification'),
  z.literal('Fellowship'),
  z.literal('Membership'),
  z.literal('Publication'),
  z.literal('Research'),
  z.literal('Training'),
  z.literal('Other'),
])
export const AccoladeSchema = z.object({
  name: z.enum([
    'Award',
    'Certification',
    'Fellowship',
    'Membership',
    'Publication',
    'Research',
    'Training',
    'Other',
  ]),
  description: z.string().min(5),
  year: z.number().min(1900).max(new Date().getFullYear()),
})

export type accoladesNames = z.infer<typeof accoladesNamesSchema>

export interface IFollowUp {
  id: number
  code: string
  consultationId: number
  doctorId: number
  followUpDate: Date
  price: number
  patientId: number
  purpose: string
  location: string
  status: string
  createdAt: Date
}

export type CreateFollowUp = Pick<
  IFollowUp,
  'followUpDate' | 'purpose' | 'location' | 'consultationId'
>
export type EditFollowUp = Pick<
  IFollowUp,
  'followUpDate' | 'purpose' | 'location' | 'id'
>

export type FinishConsultation = Pick<
  IConsultation,
  'symptoms' | 'diagnosis' | 'relatedSymptoms' | 'id'
> & {
  sbar: {
    situation: string
    background: string
    assessment: string
    diagnosis: string
    notes: string
    recommendation: string
  }
}
export const createPrescription = z.object({
  dosage: z.string(),
  frequency: z.string(),
  illness: z.string(),
  quantity: z.string(),
  medicationName: z.string(),
  medicationType: z.string(),
  medicationStrength: z.string(),
  treatmentDuration: z.string(),
})

export const InvitationSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
})

export interface ITests {
  id: number
  createdAt?: Date
  updatedAt?: Date
  category: string
  procedures: string[]
}

export interface ITotalConsultationTime {
  userId: number
  email: string
  days: number
  hours: number
  minutes: number
  seconds: number
}

export interface IPaySlip {
  id: number
  priceListName: string
  serviceId: number
  dateOnPayslip: Date
  toBePaidOut: number
}

export interface IWallet {
  id: number
  createdAt: Date
  updatedAt: Date
  userId: number
  transactions: ITransaction[]
  balance: number
  externalAccount: string
  virtualAccount: string
  bankCode: string
}

export interface ITransaction {
  id: number
  createdAt: Date
  updatedAt: Date
  amount: number
  account: string
  text: string
  reference: Date
  type: string
}

export interface IVitals {
  bloodGlucose: [
    {
      id: number
      createdAt: Date
      updatedAt: Date
      userId: number
      date: Date
      bloodGlucoseMmolPerL: number
      mealTime: Date
    },
  ]
  bloodOxygen: [
    {
      id: number
      createdAt: Date
      updatedAt: Date
      userId: number
      date: Date
      bloodOxygenPercentage: number
    },
  ]
  bloodPressure: [
    {
      id: number
      createdAt: Date
      updatedAt: Date
      userId: number
      date: Date
      systolicMmHg: number
      diastolicMmHg: number
      posture: string
    },
  ]
  bodyTemperature: [
    {
      id: number
      createdAt: Date
      updatedAt: Date
      userId: number
      date: Date
      bodyTemperatureCelsius: number
    },
  ]
  heartRate: [
    {
      id: number
      createdAt: Date
      updatedAt: Date
      userId: number
      date: Date
      heartRateBpm: number
    },
  ]
  menstruation: [
    {
      id: number
      createdAt: Date
      updatedAt: Date
      userId: number
      flow: string
      startOfCycle: boolean
      date: Date
      endOfCycleDate: Date
      startofCycleDate: Date
      contraceptive: string
    },
  ]
  respiratoryRate: [
    {
      id: number
      createdAt: Date
      updatedAt: Date
      userId: number
      date: Date
      breathsPerMinute: number
    },
  ]
}

export interface IGetMessagesByUser {
  length: number
  id: number
  subject: string
  sender: string
  message: string
  hasBeenRead: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IIssuer {
  id: number
  email: string
  mobile: string
  role: string
  name: string
}

export interface IPatients {
  userId: number
  id: number
  email: string
  mobile: string
  referralCode: string
  referralCount: number
  profileComplete: boolean
  providerId: number
  firstName: string
  surName: string
}
export interface PageAbleRequest {
  page: number
  size: string
  sort?: Record<string, string>
}

export interface PageAbleResponse<T> {
  content: T[]
  pageable: {
    sort: {
      sorted: boolean
      unsorted: boolean
      empty: boolean
    }
    offset: number
    pageNumber: number
    pageSize: number
    paged: boolean
    unpaged: boolean
  }
  size: number
  number: number
  sort: {
    sorted: boolean
    unsorted: boolean
    empty: boolean
  }
  last: boolean
  first: boolean
  numberOfElements: number
  empty: boolean
}

export interface IInquiry {
  id: number
  issuer: IIssuer
  subject: string
  message: string
  images: Array<string>
  status: string
  resolvedAt: string
  createdAt: string
  updatedAt: string
}

export interface ICreateInquiryRequest {
  subject: string
  message: string
  images: {
    encodedContent: string
    objectName: string
  }[]
}

export interface ICreateInquiryResponse {}

export interface IBanks {
  id: number
  name: string
  slug: string
  code: string
  longCode: string
  gateway: string
  payWithBank: boolean
  active: boolean
  country: string
  currency: string
  type: string
  isDeleted: boolean
}
export interface IFormValues {
  message: string
  userId: number
  subject: string
  sender: string
}

export interface FormObject {
  userId: number
  sender: string
}
