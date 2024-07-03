import { countries } from '../constants/country-states';

export interface IActiveConsultation {
	id: number;
	duration: number;
	status: string;
	timeBooked: string;
	transactionReference: string;
	transactionUrl: string;
	consultationUrl: string;
	type: 'VIRTUAL' | 'PHYSICAL';
}

export interface IProfileResponse {
	createdAt : string
	dateOfBirth: string;
	mobile: string;
	patientId: number;
	email: string;
	maritalStatus: string;
	allergies: string[];
	medicalProblems: string[];
	disabilities: string[];
	userId: any;
	id: number;
	firstName: string;
	surName: string;
	title: string;
	profileComplete: boolean;
	profilePhoto: string;
	wallet: {
		balance: number;
	} | null;
	locale: {
		languages: string[];
		preferredLanguage: string;
		closestHospital: string;
	};
	location: {
		address: string;
		zipCode: number;
		community: string;
		city: string;
		state: string;
		country: countries;
	};
	polygenic: {
		heightCm: number;
		weightKg: number;
		gender: 'Male' | 'Female' | 'Other';
		bloodType: string;
		pulse: number;
	};
	referralCount: number;
	referralCode: string;
	activeConsultation: IActiveConsultation | null;
	nationalIdNumber: number;
	unratedConsultation: UnratedConsultations[]
	ninCard: File | null;
	ninCardFileName: string;
}
type UnratedConsultations = {
	id: number;
	doctorName: string;
	date: string;
}
export interface IVitalsResponse {
	bloodGlucose: IBloodGlucose[];
	bloodOxygen: IBloodOxygen[];
	bloodPressure: IBloodPressure[];
	bodyTemperature: IBodyTemperature[];
	heartRate: IHeartRate[];
	menstruation: IMenstruation[];
	respiratoryRate: IRespiratoryRate[];
}

export interface IBloodGlucose {
	id: number;
	createdAt: string;
	updatedAt: string;
	userId: number;
	date: string;
	bloodGlucoseMmolPerL: number;
	mealTime: string;
}

export interface IBloodOxygen {
	id: number;
	createdAt: string;
	updatedAt: string;
	userId: number;
	date: string;
	bloodOxygenPercentage: number;
}

export interface IBloodPressure {
	id: number;
	createdAt: string;
	updatedAt: string;
	userId: number;
	date: string;
	systolicMmHg: number;
	diastolicMmHg: number;
	posture: string;
}

export interface IBodyTemperature {
	id: number;
	createdAt: string;
	updatedAt: string;
	userId: number;
	date: string;
	bodyTemperatureCelsius: number;
}

export interface IHeartRate {
	id: number;
	createdAt: string;
	updatedAt: string;
	userId: number;
	date: string;
	heartRateBpm: number;
}

export interface IMenstruation {
	id: number;
	createdAt: string;
	updatedAt: string;
	userId: number;
	flow: string;
	startOfCycle: boolean;
	date: string;
	endOfCycleDate: string;
	startOfCycleDate: string;
	contraceptive: string;
}

export interface IRespiratoryRate {
	id: number;
	createdAt: string;
	updatedAt: string;
	userId: number;
	date: string;
	breathsPerMinute: number;
}

export type IUpdateVitalDetailsResponse = {};

export interface IProviderResponse {
	id: number;
	address: string;
	providerName: string;
	webPageUrl: string;
	logoURL: string;
	country: string;
	currency: string;
	providerType: string;
}

export interface IProvidersResponse {
	id: any;
	providerName: any;
}

export type INationalIdResponse = {};

export type IPatientResponse = {};

export interface IUpdatePatientRequest {
	title: string;
	firstName: string;
	surName: string;
	maritalStatus: string;
	polygenic: Polygenic;
	allergies: string[];
	medicalProblems: string[];
	disabilities: string[];
	location: Location;
	locale: Locale;
	providerId?: number;
	nationalId : string;
}

export interface Polygenic {
	heightCm: number;
	weightKg: number;
	gender: string;
	bloodType: string;
}

export interface Location {
	address: string;
	zipCode: number;
	community: string;
	city: string;
	state: string;
	country: countries;
}

export interface Locale {
	languages: string[];
	preferredLanguage: string;
	closestHospital: string;
}

export type IUpdatePatientResponse = {};

export type ICompleteProfileResponse = {};

export interface ICompleteProfileRequest {
	title: string;
	firstName: string;
	surName: string;
	dateOfBirth: Date | null;
	gender: string;
	country: string;
	city: string;
	community: string;
	state: string;
	address: string;
	language: string[];
	mobile : string;
	referallCode : string
}
export interface IChildrenResponse {
	childId: number;
	name: string;
	dateOfBirth: string;
	partnerFirstName: string;
	partnerLastName: string;
	partnerNationalIdNumber: string;
	partnerPhoneNumber: string;
	partnerEmailId: string;
	birthCertificate: string;
	NINCard: string;
	notes: string;
	patientId: string,
	status : string,
	partner: {
		id: Number;
		firstName: string;
		lastName: string
		email: string;
		mobile: string
		nationalIdNumber: string;
	},
	polygenic: Polygenic;
	allergies: string[];
	medicalProblems: string[];
	disabilities: string[];
}

export interface IChildResponse {
	surName: string;
	firstName: string;
}

export type ICreateChildResponse = {};

export type ICreateChildRequest = {};

export type IUpdateChildResponse = {};

export interface IUpdateChildRequest {
	childId: Number,
	firstName: string,
	dateOfBirth: string,
	gender: string,
	partnerFirstName: string,
	partnerLastName: string,
	partnerNationalIdNumber: string,
	partnerEmail: string,
	partnerPhoneNumber: string
}

export interface IUpdateChildStatusRequest {
	childId: Number,
	status : Number,
	notes : string
}

export interface IConsultationResponse {
	id: number;
	roomName: string;
	status: string;
	consultationUrl: string;
	timeBooked?: string;
	transactionUrl?: string;
	consultationType: 'VIRTUAL' | 'PHYSICAL';
}

type ImageContent = { encodedContent: string; objectName: string };

export interface ICreateConsultationRequest {
	bodyArea: string[];
	textDetailedDescription: string;
	audioDetailedDescription: number[];
	amountPaid: number;
	priceListName: string;
	images: ImageContent[];
	consultationType: 'VIRTUAL' | 'PHYSICAL';
	paymentProvider: string;
	childId: Number;
}

/*
export interface ICreateConsultationRequest {
	bodyArea: string[];
	textDetailedDescription: string;
	audioDetailedDescription: number[];
	amountPaid: number;
	priceListName: string;
	images: ImageContent[];
	consultationType: 'VIRTUAL' | 'PHYSICAL';
}
*/

export interface ICreateConsultationResponse {
	id: number;
	status: string;
	timeBooked: string;
	clientSecret: string;
	referenceId: string;
	transactionUrl: string;
	paymentProvider: string;
	duration: number;
}

export interface ICancelConsultationResponse {
	wallet: number;
}

export interface IConsultationPriceResponse {
	price: number;
}

export interface IPrescriptionResponse {
	patientName: string;
	id: number;
	issueDate: string;
	issuerName: string;
	dosage: string;
	frequency: string;
	illness: string;
	quantity: string;
	medicationName: string;
	medicationType: string;
	medicationStrength: string;
	treatmentDuration: string;
	withdrawals: string;
	amountPerWithdrawal: string;
	status: string;
	consultationId: number;
	recipientName: string;
}

export interface IMessageResponse {
	id: number;
	subject: string;
	sender: string;
	message: string;
	createdAt: string;
	updatedAt: string;
	hasBeenRead: boolean;
}

export interface IVerifyPaymentRequest {
	referenceId: string;
	paymentProvider: string;
}

export interface IVerifyPaymentResponse {
	status: 'success' | 'failed';
}

export type ICreateFeedbackRequest = {
	consultationId: number;
	rating: number;
};

export type ICreateFeedbackResponse = {};

export type ICreateInquiryRequest = {};

export type ICreateInquiryResponse = {};

export interface ISummaryResponse {
	name: string;
	consultationId: number;
	symptoms: string[];
	relatedSymptoms: string[];
	diagnosis: string;
	doctorName: string;
	timeFinished: string;
	prescriptions: Prescription[];
	labrequests: ILabResultsResponse[];
	followUp: IFollowUpResponse;
	sbar: Sbar;
}

export interface Prescription {
	id: number;
	issueDate: string;
	issuerName: string;
	dosage: string;
	frequency: string;
	illness: string;
	quantity: string;
	medicationName: string;
	medicationType: string;
	medicationStrength: string;
	treatmentDuration: string;
	withdrawals: string;
	amountPerWithdrawal: string;
	status: string;
	consultationId: number;
}

export interface ILabResultsResponse {
	id: number;
	doctorName: string;
	patientName: string;
	reason: string;
	test: string;
	createdAt: string;
	updatedAt: string;
}

export interface IFollowUpResponse {
	patientName: string;
	doctorName: string;
	id: number;
	price: number;
	purpose: string;
	location: string;
	status: string;
	followUpDate: string;
	createdAt: string;
	updatedAt: string;
	timeFinished?: string;
}

export interface Sbar {
	id: number;
	situation: string;
	background: string;
	assessment: string;
	recommendation: string;
	notes: string;
	diagnosis: string;
}

export interface IReceiptResponse {
	patientName: string;
	patientNationalIdNumber: string;
	hospital: string;
	amountPaid: string;
	timeAccepted: string;
	timeFinished: string;
}

export interface IInvitation {
	id: number;
	email: string;
	name: string;
	invitedByName: string;
	invitedById: number;
	registrationDate: Date;
	createdAt: Date;
	status: string;
}

export type ICreateInvitationRequest = {};

export type ICreateInvitationResponse = {};

export type IResendInvitationResponse = {};

export interface IStripePayment{
	clientSecret: string;
}

export interface IPaystackPayment{
	transactionUrl: string;
}

export interface IPaymentInfo{
	paymentProvider: string;
	referenceId: string;
	data: IPaystackPayment | IStripePayment | null
}