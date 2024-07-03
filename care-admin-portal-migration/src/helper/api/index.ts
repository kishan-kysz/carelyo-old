import { IPriceSubmitForm } from '@/components/prices/types';
import apiCall from '../utils/axiosConfig';
import {
	IConsultationResponse,
	IGetAcceptingDoctorsResponse,
	IGetAmountPaidForConsultationsOverTimeResponse,
	IGetConsultationsGenderDistributionResponse,
	IGetConsultationsMetricsResponse,
	IGetDoctorResponse,
	IGetDoctorsResponse,
	IGetPatientResponse,
	IGetPatientsResponse,
	IGetPriceResponse,
	IGetTotalCompletedConsultationTimePerDoctorResponse,
	IGetRelationshipResponse,
	IGetPayrollResponse,
	IGetFinishedConsultationsRatingDistributionResponse,
	IGetTemplateResponse,
	IGetProviderResponse,
	IGetPrescriptionsResponse,
	IGetPrescriptionResponse,
	IGetLabRequestsResponse,
	IGetUsersResponse,
	IGetUserResponse,
	IGetAllInquiriesResponse,
	IGetInquiryById,
	IGetAllSupportTickets,
	ICreateSupportTicketFromAnInquiry,
	IGetTicketByID,
	ICompletePatientProfileRequest,
	Polygenic,
	Locale,
	Location,
	IGetFullPatientProfileResponse
} from './../utils/types';

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getAllConsultations = async () => {
	const res = await apiCall('/api/v1/admin/consultations', 'GET');
	return res.data as IConsultationResponse[];
};
export const getAllDoctors = async () => {
	const res = await apiCall('/api/v1/admin/doctors', 'GET');
	return res.data as IGetDoctorsResponse[];
};
export const getAllPatients = async () => {
	const res = await apiCall('/api/v1/admin/patients', 'GET');
	return res.data as IGetPatientsResponse[];
};
export const createPatient = async (body: {
	email: string;
	mobile: string;
}) => {
	const request = {
		...body,
		consent: true
	};
	const res = await apiCall('/api/v1/auth/register/patient', 'POST', request);
	return res.data;
};
export const createPatientFullProfile = async (data: {
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
}) => {
	const { userId, ...request } = data;
	const res = await apiCall(`/api/v1/patients/profile/edit/${userId}`, 'PUT', request);
	return res.data as ICompletePatientProfileRequest;
};

export const completePatientProfile = async (data: {
	userId: number;
	nationalIdNumber: string;
	dateOfBirth: Date;
}) => {
	const { userId, ...request } = data;
	const res = await apiCall(`/api/v1/patients/profile/complete/${userId}`, 'PUT', request);
	return res.data as ICompletePatientProfileRequest;
};

export const createDoctor = async (body: {
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
}) => {
	const request = {
		email: body.email,
		mobile: body.mobile,
		role: 'doctor',
		password: 'password',
		firstName: body.firstName,
		lastName: body.lastName,
		fullName: `${body.firstName} ${body.lastName}`,
		medicalCertificate: {
			certificateNumber: `MDCN/R/${body.mdcnCertificateNumber}`,
			issuedDate: body.mdcnIssuedDate.toISOString(),
			expirationDate: body.mdcnExpirationDate.toISOString()
		},
		nationalIdNumber: body.nationalIdNumber,
		hospital: body.hospital,
		providerId: body.providerId,
		consent: true
	};
	const res = await apiCall('/api/v1/auth/register/doctor', 'POST', request);
	return res.data;
};

export const updatePatient = async ({
	id,
	email,
	mobile
}: {
	id: number;
	email: string;
	mobile: string;
}) => {
	const res = await apiCall(`/api/v1/admin/users/patient/update/${id}`, 'PUT', {
		email,
		mobile
	});
	return res.data;
};
export const updateDoctor = async ({
	id,
	email,
	mobile,
	firstName,
	lastName,
	mdcnCertificateNumber,
	mdcnIssuedDate,
	mdcnExpirationDate,
	hospital,
	nationalIdNumber
}: {
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
}) => {
	const res = await apiCall(`/api/v1/admin/users/doctor/update/${id}`, 'PUT', {
		email,
		mobile,
		firstName,
		lastName,
		medicalCertificate: {
			certificateNumber: `MDCN/R/${mdcnCertificateNumber}`,
			issuedDate: mdcnIssuedDate,
			expirationDate: mdcnExpirationDate
		},
		hospital,
		nationalIdNumber
	});
	return res.data;
};
export const getPatient = async (userId: number) => {
	const res = await apiCall(`/api/v1/admin/users/${userId}`, 'GET');
	return res.data as IGetPatientResponse;
};
export const getFullPatientProfile = async () => {
	const res = await apiCall('/api/v1/patients', 'GET');
	return res.data as IGetFullPatientProfileResponse;
};
export const getCompletePatientProfile = async (userId: number) => {
	const res = await apiCall(`/api/v1/patients/${userId}`, 'GET');
	return res.data as ICompletePatientProfileRequest;
};
export const getDoctor = async (userId: number) => {
	const res = await apiCall(`/api/v1/admin/users/${userId}`, 'GET');
	return res.data as IGetDoctorResponse;
};
export const getPrices = async () => {
	const res = await apiCall('/api/v1/payout/price-lists', 'GET');
	return res.data as IGetPriceResponse[];
};
export const getPrice = async (name: string) => {
	const res = await apiCall(`/api/v1/payout/price-list?name=${name}`, 'GET');
	return res.data as IGetPriceResponse;
};
export const createPrice = async (body: {
	name: string;
	price: number;
	vat: number;
	commission: number;
	duration: number;
}) => {
	const request = {
		name: body.name,
		price: body.price,
		vat: body.vat,
		commission: body.commission,
		duration: body.duration
	};
	const res = await apiCall('/api/v1/payout/price-list', 'POST', request);
	return res.data;
};
export const updatePrice = async (
	payload: IPriceSubmitForm
) => {
	const res = await apiCall('/api/v1/payout/price-list', 'PUT', payload);
	return res.data;
};
export const deletePrice = async (name: string) => {
	const res = await apiCall(`/api/v1/payout/price-list?name=${name}`, 'DELETE');
	return res.data;
};
export const getConsultationsMetrics = async (startDate: Date, endDate: Date) => {
	const res = await apiCall(
		`/api/v1/admin/metrics/consultations?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
		'GET'
	);
	return res.data as IGetConsultationsMetricsResponse;
};
export const getAcceptingDoctorsResponseMetrics = async () => {
	const res = await apiCall('/api/v1/admin/metrics/consultations/accepted/doctors', 'GET');
	return res.data as IGetAcceptingDoctorsResponse[];
};
export const getTotalCompletedConsultationTimePerDoctorMetrics = async () => {
	const res = await apiCall('/api/v1/admin/metrics/consultations/completed-time/total-per-doctor', 'GET');
	return res.data as IGetTotalCompletedConsultationTimePerDoctorResponse[];
};
export const getConsultationsGenderDistributionMetrics = async () => {
	const res = await apiCall('/api/v1/admin/metrics/consultations/gender-distribution', 'GET');
	return res.data as IGetConsultationsGenderDistributionResponse[];
};
export const getAmountPaidForConsultationsOverTime = async (startDate: Date, endDate: Date, period: string) => {
	const res = await apiCall(
		`/api/v1/admin/metrics/consultations/amount-paid?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&period=${period}`,
		'GET'
	);
	return res.data as IGetAmountPaidForConsultationsOverTimeResponse[];
};
export const getNumberOfOngoingConsultationsMetrics = async () => {
	const res = await apiCall('/api/v1/admin/metrics/consultations/total-by-status?status=started', 'GET');
	return res.data;
};
export const getNumberOfIncomingConsultationsMetrics = async () => {
	const res = await apiCall('/api/v1/admin/metrics/consultations/total-by-status?status=booking', 'GET');
	return res.data;
};
export const getNumberOfAcceptedConsultationsMetrics = async () => {
	const res = await apiCall('/api/v1/admin/metrics/consultations/total-by-status?status=accepted', 'GET');
	return res.data;
};
export const getNumberOfBookedConsultationsMetrics = async () => {
	const res = await apiCall('/api/v1/admin/metrics/consultations/total-by-status?status=booked', 'GET');
	return res.data;
};
export const getNumberOfFinishedConsultationsMetrics = async () => {
	const res = await apiCall('/api/v1/admin/metrics/consultations/total-by-status?status=finished', 'GET');
	return res.data;
};
export const getNumberOfConsultationsByAgeSpansMetrics = async (ages: number[]) => {
	let requestParameters = '';

	for (let i = 0; i < ages.length; i++) {
		requestParameters += `ages=${ages[i]}&`;
	}

	const res = await apiCall(`/api/v1/admin/metrics/consultations/total-by-age-spans?${requestParameters}`, 'GET');
	return res.data;
};
export const getRelationshipBetweenIllnessAndGenderMetrics = async () => {
	const res = await apiCall('/api/v1/admin/metrics/consultations/relationships/illness-and-gender', 'GET');
	return res.data as IGetRelationshipResponse[];
};
export const getRelationshipBetweenIllnessAndAgeMetrics = async () => {
	const res = await apiCall('/api/v1/admin/metrics/consultations/relationships/illness-and-age', 'GET');
	return res.data as IGetRelationshipResponse[];
};
export const getRelationshipBetweenIllnessAndTimeMetrics = async () => {
	const res = await apiCall('/api/v1/admin/metrics/consultations/relationships/illness-and-time', 'GET');
	return res.data as IGetRelationshipResponse[];
};
export const getPayroll = async () => {
	const res = await apiCall('/api/v1/payout/get-payroll', 'GET');
	return res.data as IGetPayrollResponse[];
};
export const getPayrollHistory = async () => {
	const res = await apiCall('/api/v1/payout/get-payroll-history', 'GET');
	return res.data as IGetPayrollResponse[];
};
export const getFinishedConsultationsRatingDistribution = async () => {
	const res = await apiCall('/api/v1/admin/metrics/consultations/finished/rating-distribution', 'GET');
	return res.data as IGetFinishedConsultationsRatingDistributionResponse[];
};
export const getAllTemplates = async () => {
	const res = await apiCall('/api/v1/templates', 'GET');
	return res.data as IGetTemplateResponse[];
};
export const updateTemplate = async ({
	type,
	html
}: {
	type: string;
	html: string;
}) => {
	const res = await apiCall(`/api/v1/templates/update/${type}`, 'PUT', {
		html,
		type
	});
	return res.data;
};
export const getTemplate = async ({ type }: { type: string }) => {
	const res = await apiCall(`/api/v1/templates/${type}`, 'GET');
	return res.data as IGetTemplateResponse;
};

export const getProviders = async () => {
	const res = await apiCall('/api/v1/providers', 'GET');
	return res.data as IGetProviderResponse[];
};
export const getProvider = async (providerId: number) => {
	const res = await apiCall(`/api/v1/providers/${providerId}`, 'GET');
	return res.data as IGetProviderResponse[];
};

export const createProvider = async (body: {
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
}) => {
	const request = {
		providerName: body.providerName,
		phoneNumber: body.phoneNumber,
		address: body.address,
		practiceNumber: body.practiceNumber,
		email: body.email,
		secondaryEmail: body.secondaryEmail,
		webPageUrl: body.webPageUrl,
		country: body.country,
		currency: body.currency,
		logoURL: body.logoURL,
		providerType: body.providerType
	};
	const res = await apiCall('/api/v1/providers/create', 'POST', request);
	return res.data;
};

export const updateProvider = async ({
	id,
	providerName,
	phoneNumber,
	address,
	practiceNumber,
	email,
	secondaryEmail,
	webPageUrl,
	country,
	currency,
	logoURL,
	providerType
}: {
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
}) => {
	const res = await apiCall(`/api/v1/providers/update/${id}`, 'PUT', {
		id,
		providerName,
		phoneNumber,
		address,
		practiceNumber,
		email,
		secondaryEmail,
		webPageUrl,
		country,
		currency,
		logoURL,
		providerType
	});
	return res.data;
};
export const deleteProvider = async (id: number) => {
	const res = await apiCall(`/api/v1/providers/delete/${id}`, 'DELETE');
	return res.data;
};
export const setPayoutAsPaid = async ({
	serviceId,
	reference
}: {
	serviceId: string;
	reference: string;
}) => {
	const optionalReference = reference !== undefined && reference.length > 0 ? `?reference="${reference}"` : '';
	const res = await apiCall(`/api/v1/payout/mark-as-paid/${serviceId}${optionalReference}`, 'PUT');
	return res.data;
};

export const getAllPrescriptions = async () => {
	const res = await apiCall('/api/v1/consultations/prescriptions', 'GET');
	return res.data as IGetPrescriptionsResponse[];
};

export const getPrescription = async (prescriptionId: number) => {
	const res = await apiCall(`/api/v1/consultations/prescription/${prescriptionId}`, 'GET');
	return res.data as IGetPrescriptionResponse;
};

export const getLabRequests = async () => {
	const res = await apiCall('/api/v1/consultations/labrequests', 'GET');
	return res.data as IGetLabRequestsResponse[];
};
export const getUsers = async () => {
	const res = await apiCall('/api/v1/admin/users', 'GET');
	return res.data as IGetUsersResponse[];
};

export const getUser = async (userId: number) => {
	const res = await apiCall(`/api/v1/admin/users/${userId}`, 'GET');
	return res.data as IGetUserResponse;
};

export const createAdminUser = async (body: {
	email: string;
	password: string;
	mobile: string;
	firstName: string;
	lastName: string;
}) => {
	const request = {
		email: body.email,
		password: body.password,
		mobile: body.mobile,
		firstName: body.firstName,
		lastName: body.lastName
	};
	const res = await apiCall('/api/v1/auth/register/admin', 'POST', request);
	return res.data;
};

export const updateUserRole = async ({ id, role }: { id: number; role: string }) => {
	const res = await apiCall(`/api/v1/admin/users/role/add/${role}?userId=${id}`, 'PUT');
	return res.data;
};

export const getAllInquiries = async (page: number, size: number) => {
	const res = await apiCall(`/api/v1/inquiries/?page=${page}&size=${size}&sort=`, 'GET');
	return res.data as IGetAllInquiriesResponse;
};
export const getInquiriesByUserId = async (userId: number, page: number = 0, size: number = 15) => {
	const res = await apiCall(`/api/v1/inquiries/user/${userId}?page=${page}&size=${size}&sort=`, 'GET');
	return res.data as IGetAllInquiriesResponse;
};

export const getInquiryById = async ({ id }: { id: number }) => {
	const res = await apiCall(`/api/v1/inquiries/${id}`, 'GET');
	return res.data as IGetInquiryById;
};

export const getInquiriesByQuery = async ({ query }: { query: string }) => {
	const { data } = await apiCall(`/api/v1/inquiries/search?query=${query}&page=0&size=12&sort=`, 'GET');
	return data as IGetAllInquiriesResponse;
};

export const updateInquiryStatus = async ({ id, status }: { id: number; status: string }) => {
	const res = await apiCall(`/api/v1/inquiries/update/status/${id}?status=${status}`, 'PUT');
	return res.data;
};

export const getAllSupportTickets = async (page: number, size: number) => {
	const res = await apiCall(`/api/v1/support/tickets/?page=${page}&size=${size}&sort=`, 'GET');
	return res.data as IGetAllSupportTickets;
};

export const getMyTickets = async (page: number, size: number) => {
	const res = await apiCall(`/api/v1/support/ticket/assignee?page=${page}&size=${size}`, 'GET');
	return res.data as IGetAllSupportTickets;
};

export const createSupportTicketFromAnIquiry = async (body: {
	inquiryId: number | undefined;
	category: string;
	type: string;
	priority: string;
	assigneeId: number;
	tags: string[];
}) => {
	const requestBody = {
		inquiryId: body.inquiryId,
		category: body.category,
		type: body.type,
		priority: body.priority,
		assigneeId: body.assigneeId,
		tags: body.tags
	};

	const res = await apiCall('/api/v1/support/ticket/create', 'POST', requestBody);
	return res.data as ICreateSupportTicketFromAnInquiry;
};

export const getTicketById = async (entryId: number) => {
	const res = await apiCall(`/api/v1/support/ticket/${entryId}`, 'GET');
	return res.data as IGetTicketByID;
};

export const AddCommentToTicket = async (body: {
	ticketId: number | undefined;
	message: string;
}) => {
	const requestBody = {
		ticketId: body.ticketId,
		message: body.message
	};
	const res = await apiCall('/api/v1/support/ticket/comment/create', 'POST', requestBody);
	return res.data;
};

export const assignTicket = async ({ id, assigneeId }: { id: number; assigneeId: number }) => {
	const res = await apiCall(`/api/v1/support/ticket/assign/${id}?assigneeId=${assigneeId}`, 'PUT');
	return res.data as IGetTicketByID;
};

export const unAssignTicket = async ({ id }: { id: number }) => {
	const res = await apiCall(`/api/v1/support/ticket/unassign/${id}`, 'PUT');
	return res.data as IGetTicketByID;
};

export const addTicketTag = async ({ id, tag }: { id: number; tag: string }) => {
	const res = await apiCall(`/api/v1/support/ticket/tag/add/${id}?tag=${tag}`, 'PUT');
	return res.data as IGetTicketByID;
};

export const removeTicketTag = async ({ id, tag }: { id: number; tag: string }) => {
	const res = await apiCall(`/api/v1/support/ticket/tag/remove/${id}?tag=${tag}`, 'PUT');
	return res.data as IGetTicketByID;
};

export const updateTicketCategory = async ({ id, category }: { id: number; category: string }) => {
	const res = await apiCall(`/api/v1/support/ticket/update/${id}?category=${category}`, 'PUT');
	return res.data as IGetTicketByID;
};

export const updateTicketType = async ({ id, type }: { id: number; type: string }) => {
	const res = await apiCall(`/api/v1/support/ticket/update/${id}?type=${type}`, 'PUT');
	return res.data as IGetTicketByID;
};

export const updateTicketPriority = async ({ id, priority }: { id: number; priority: string }) => {
	const res = await apiCall(`/api/v1/support/ticket/update/${id}?priority=${priority}`, 'PUT');
	return res.data as IGetTicketByID;
};

export const updateTicketStatus = async ({ id, status }: { id: number | undefined; status: string }) => {
	const res = await apiCall(`/api/v1/support/ticket/update/${id}?status=${status}`, 'PUT');
	return res.data as IGetTicketByID;
};

export const deleteAComment = async ({ commentId, ticketId }: { commentId: number | undefined; ticketId: number }) => {
	const res = await apiCall(`/api/v1/support/ticket/comment/delete/${commentId}?ticketId=${ticketId}`, 'DELETE');
	return res.data;
};

export const updateAComment = async (body: { commentId: number; ticketId: number; message: string }) => {
	const requestBody = {
		ticketId: body.ticketId,
		message: body.message
	};
	const response = await apiCall(`/api/v1/support/ticket/comment/edit/${body.commentId}`, 'PUT', requestBody);
	return response.data;
};

export const sendMessage = async (body: { userId: number; sender: string; subject: string; message: string }) => {
	const res = await apiCall('/api/v1/messages/create/user', 'POST', body);
	return res.data;
};
