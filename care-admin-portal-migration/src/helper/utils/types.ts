export interface IConsultationResponse {
	consultationId: number;
	createdAt: string;
	updatedAt: string;
	acceptedConsultations: boolean;
	patientFullName: string;
	patientId: number;
	doctorFullName: string;
	doctorId: number;
	roomName: string;
	transactionReference: string;
	transactionUrl: string;
	priceListName: string;
	amountPaid: string;
	language: string;
	status: string;
	timeBooked: number;
	timeAccepted: number;
	timeStarted: number;
	timeFinished: number;
	followUpId: number;
	rating: {
		id: number;
		createdAt: string;
		updatedAt: string;
		score: number;
		ratedUserId: number;
		ratedProduct: number;
	};
}

export interface Rating {
	id: number;
	createdAt: string;
	updatedAt: string;
	score: number;
	ratedUserId: number;
	ratedProduct: number;
}

export interface IGetDoctorResponse {
	email: string;
	mobile: string;
	firstName: string;
	lastName: string;
	medicalCertificate: {
		certificateNumber: string;
		issuedDate: Date;
		expirationDate: Date;
	};
	hospital: string;
	nationalIdNumber: number;
}
export interface IGetPatientResponse {
	email: string;
	mobile: string;
}
export interface IGetFullPatientProfileResponse {
	userId: number;
	email: string;
	mobile: string;
	referralCode: string;
	referralCount: number;
	profileComplete: boolean;
	providerId: number;
}
export interface IGetPatientsResponse {
	userId: number;
	email: string;
	mobile: string;
	createdAt: string;
	updatedAt: string;
}
export interface IGetDoctorsResponse {
	userId: number;
	email: string;
	mobile: string;
	firstName: string;
	lastName: string;
	medicalCertificate: {
		certificateNumber: string;
		issuedDate: Date;
		expirationDate: Date;
	};
	hospital: string;
	nationalIdNumber: number;
	createdAt: string;
	updatedAt: string;
}
export interface IGetPriceResponse {
	name: string;
	prices: {
		price: number;
		vat: number;
		commission: number;
		duration: number;
	};
}
export interface IGetConsultationsMetricsResponse {
	totalNumberOfConsultations: number;
	totalNumberOfConsultationsPerYear: number[];
	totalNumberOfConsultationsPerMonth: number[];
	totalNumberOfConsultationsPerWeek: number[];
	totalNumberOfConsultationsPerDay: number[];
	totalNumberOfConsultationsPerHour: number[];
	avgNumberOfConsultationsPerHourPerYear: number[];
	avgNumberOfConsultationsPerHourPerMonth: number[];
	avgNumberOfConsultationsPerHourPerWeek: number[];
	avgNumberOfConsultationsPerHourPerDay: number[];
	avgNumberOfConsultationsPerDayPerYear: number[];
	avgNumberOfConsultationsPerDayPerMonth: number[];
	avgNumberOfConsultationsPerDayPerWeek: number[];
	avgNumberOfConsultationsPerWeekPerYear: number[];
	avgNumberOfConsultationsPerWeekPerMonth: number[];
	avgNumberOfConsultationsPerMonthPerYear: number[];
}
export interface IGetAcceptingDoctorsResponse {
	userId: number;
	email: string;
	firstName: string;
	lastName: string;
}
export interface IGetConsultationsGenderDistributionResponse {
	gender: string;
	quantity: number;
	ratio: number;
}
export interface IGetTotalCompletedConsultationTimePerDoctorResponse {
	userId: number;
	email: string;
	firstName: string;
	lastName: string;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	milliSeconds: number;
}
export interface IGetAmountPaidForConsultationsOverTimeResponse {
	period: string;
	amountPaid: number;
}
export interface IGetNumberOfConsultationsByAgeSpansResponse {
	ageSpan: string;
	numberOfConsultations: number;
}
export interface IGetRelationshipResponse {
	variableOne: string;
	variableTwo: string;
	percentage: number;
}
export interface IGetPayrollResponse {
	id: number;
	priceListName: string;
	serviceId: number;
	payStackRef: string;
	dateOnPayroll: number;
	dateOnPayslip: number;
	datePaidOut: number;
	paidByUserId: number;
	price: number;
	vat: number;
	commission: number;
	toBePaidOut: number;
	updatedAt: string;
	createdAt: string;
}
export interface IGetFinishedConsultationsRatingDistributionResponse {
	rating: string;
	quantity: number;
	ratio: number;
}
export interface IGetTemplateResponse {
	id: number;
	html: string;
	templateType: string;
}
export interface IUpdatePatientRequest {
	id: number;
	email: string;
	mobile: string;
}
export interface ICreatePatientRequest {
	email: string;
	mobile: string;
}
export interface ICreateDoctorRequest {
	email: string;
	mobile: string;
	firstName: string;
	lastName: string;
	mdcnCertificateNumber: string;
	mdcnIssuedDate: Date;
	mdcnExpirationDate: Date;
	hospital: string;
	nationalIdNumber: number;
	providerId: string;
}
export interface IUpdateDoctorRequest {
	id: number;
	email: string;
	mobile: string;
	firstName: string;
	lastName: string;
	mdcnCertificateNumber: string;
	mdcnIssuedDate: Date;
	mdcnExpirationDate: Date;
	hospital: string;
	nationalIdNumber: number;
}

export interface IErrorReponse {
	code: string;
	field: string;
	message: string;
}

export interface IGetProviderResponse {
	id: number;
	createdAt: string;
	updatedAt: string;
	providerName: string;
	phoneNumber: string;
	address: string;
	practiceNumber: string;
	email: string;
	secondaryEmail: string;
	webPageUrl: string;
	logoURL: string;
	logoFilePath: string;
	bucketName: string;
	country: string;
	currency: string;
	providerType: string;
}

export interface ICreateProviderRequest {
	providerName: string;
	phoneNumber: string;
	address: string;
	practiceNumber: string;
	email: string;
	secondaryEmail: string;
	webPageUrl: string;
	country: string;
	currency: string;
	logoURL: string;
	providerType: string;
}

export interface IUpdateProviderRequest {
	id: number;
	providerName: string;
	phoneNumber: string;
	address: string;
	practiceNumber: string;
	email: string;
	secondaryEmail: string;
	webPageUrl: string;
	country: string;
	currency: string;
	logoURL: string;
	providerType: string;
}

export interface IGetPrescriptionsResponse {
	id: number;
	issueDate: number | Date;
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
}
export interface IGetPrescriptionResponse {
	id: number;
	createdAt: string;
	updatedAt: string;
	consultationId: number;
	patientId: number;
	doctorId: number;
	recipientName: string;
	issueDate: number;
	dosage: string;
	frequency: string;
	illness: string;
	medicationName: string;
	quantity: string;
	medicationStrength: string;
	medicationType: string;
	treatmentDuration: string;
	withdrawals: string;
	amountPerWithdrawal: string;
	issuerName: string;
	fulfilledDate: number;
	status: string;
}

export interface IGetLabRequestsResponse {
	id: number;
	doctorName: string;
	patientName: string;
	reason: string;
	test: string;
	createdAt: string;
	updatedAt: string;
}
export interface IGetUsersResponse {
	id: number;
	email: string;
	mobile: string;
	role: string;
}

export interface IGetUserResponse {
	id: number;
	createdAt: string;
	updatedAt: string;
	email: string;
	password: string;
	mobile: string;
	role: IUserRole;
	profileComplete: boolean;
	referralCode: string;
	referralCount: number;
	consent: boolean;
	userDTO: IGetUsersResponse;
	fullName?: string;
}

export interface IUserRole {
	id: number;
	createdAt: string;
	updatedAt: string;
	name: string;
}

export interface ICreateUserRequest {
	email: string;
	password: string;
	mobile: string;
	firstName: string;
	lastName: string;
}

export interface IUpdateUserRequest {
	id: number;
	role: string;
}

export interface IGetAllInquiriesResponse {
	// [x: string]: any;
	size: number;
	content: IGetAllInquiriesContent[];
	number: number;
	sort: {
		unsorted: boolean;
		sorted: boolean;
		empty: boolean;
	};
	last: boolean;
	numberOfElements: number;
	first: boolean;
	totalPages: number;
	totalElements: number;
	pageNumber: number;
	pageable: IInqPageable;
	empty: boolean;
}

export interface IContentSorted {
	sort: {
		unsorted: boolean;
		sorted: boolean;
		empty: boolean;
	};
}
export interface IInqPageable {
	offset: number;
	sort: IContentSorted;
	pageNumber: number;
	pageSize: number;
	paged: boolean;
	unpaged: boolean;
}
export interface IGetAllInquiriesContent {
	id: number;
	issuer: {
		id: number;
		email: string;
		mobile: string;
		role: string;
	};
	subject: string;
	message: string;
	status: StatusTypes;
	resolvedAt: string | null;
	createdAt: string;
	upadtedAt?: string;
	images?: [string];
}

export interface IIusser {
	id: number;
	name: string;
	email: string;
	mobile: string;
	role: string;
}
export interface IGetInquiryById {
	id: number;
	subject: string;
	message: string;
	status: StatusTypes;
	resolvedAt?: string;
	images: [string];
	createdAt: string;
	updatedAt: string;
	issuer: IIusser;
}

export interface IGetAllSupportTickets {
	totalPages: number;
	totalElements: number;
	size: number;
	content: [ISupportTicketContent];
	number: number;
	sort: {
		sorted: boolean;
		unsorted: boolean;
		empty: boolean;
	};
	last: boolean;
	pageable: {
		offset: number;
		sort: {
			sorted: boolean;
			unsorted: boolean;
			empty: boolean;
		};
		pageNumber: number;
		pageSize: number;
		paged: boolean;
		unpaged: boolean;
	};
	numberOfElements: number;
	first: boolean;
	empty: boolean;
}

export interface ISupportTicketContent {
	id: number;
	createdById: number;
	inquiryId: number;
	assigneeId: number;
	category: string;
	type: string;
	priority: string;
	status: StatusTypes;
}

export type StatusTypes = 'Open' | 'Viewed' | 'Investigating' | 'Closed' | 'Resolved' | 'Deleted';

export interface ICreateSupportTicketFromAnInquiry {
	id: number;
	createdBy: {
		id: number;
		firstName: string;
		lastName: string;
	};
	inquiry: {
		id: number;
		issuer: IIusser;
		subject: string;
		message: string;
		images: [string];
		status: string;
		resolvedAt: string;
		createdAt: string;
		updatedAt: string;
	};
	assignee: {
		id: number;
		firstName: string;
		lastName: string;
	};
	category: string;
	type: string;
	priority: string;
	status: StatusTypes;
	actionsTaken: [
		{
			id: number;
			createdAt: string;
			updatedAt: string;
			userId: number;
			ticketId: number;
			action: string;
			message: string;
		}
	];
	comments: [
		{
			id: number;
			createdAt: string;
			updatedAt: string;
			userId: number;
			message: string;
			ticketId: number;
			hidden: boolean;
		}
	];
}

export interface IGetTicketByID {
	id: number;
	createdBy: {
		id: number;
		firstName: string;
		lastName: string;
	};
	inquiry: {
		id: number;
		issuer: {
			id: number;
			email: string;
			mobile: string;
			role: string;
		};
		subject: string;
		message: string;
		images: [string];
		status: StatusTypes;
		resolvedAt: string;
		createdAt: string;
		updatedAt: string;
	};
	assignee: {
		userId: number;
		firstName: string;
		lastName: string;
	};
	category: string;
	type: string;
	priority: string;
	status: StatusTypes;
	actionsTaken: IActionsTaken[];
	comments: IComments[];
	tags: [];
}

export interface IComments {
	id: number;
	createdAt: string;
	updatedAt: string;
	userId: number;
	ticketId: number;
	action: string;
	message: string;
	hidden: boolean;
}

export interface IActionsTaken {
	id: number;
	createdAt: string;
	updatedAt: string;
	userId: number;
	ticketId: number;
	action: string;
	message: string;
}

export interface ITags {
	value: string;
	label: string;
}
export interface ICompletePatientProfileRequest {
	userId: number;
	profileComplete: boolean;
	patientId: number;
	title: string;
	nationalIdNumber: string;
	firstName: string;
	surName: string;
	dateOfBirth: Date;
	maritalStatus: string;
	hasChildren: boolean;
	numOfChildren: number;
	polygenic: Polygenic;
	allergies: string[];
	medicalProblems: string[];
	disabilities: string[];
	location: Location;
	locale: Locale;
	referralCode: string;
	referralCount: number;
	providerId: number;
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
	country: string;
}

export interface Locale {
	languages: string[];
	preferredLanguage: string;
	closestHospital: string;
}

export interface IDeleteAComment {
	id: number;
	createdBy: {
		userId: number;
		firstName: string;
		lastName: string;
	};
	inquiry: {
		id: number;
		issuer: {
			id: number;
			email: string;
			mobile: string;
			role: string;
			name: string;
		};
		subject: string;
		message: string;
		images: [string];
		status: string;
		resolvedAt: string;
		createdAt: string;
		updatedAt: string;
	};
	assignee: {
		userId: number;
		firstName: string;
		lastName: string;
	};
	category: string;
	type: string;
	priority: string;
	status: string;
	actionsTaken: [
		{
			id: number;
			createdAt: string;
			updatedAt: string;
			userId: number;
			ticketId: number;
			action: string;
			message: string;
		}
	];
	comments: [
		{
			id: number;
			createdAt: string;
			updatedAt: string;
			userId: number;
			message: string;
			ticketId: number;
			hidden: true;
		}
	];
	tags: [string];
}
