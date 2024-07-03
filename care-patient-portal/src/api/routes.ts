import Cookies from 'js-cookie';
import {
	ICancelConsultationResponse,
	IChildrenResponse,
	ICompleteProfileRequest,
	ICompleteProfileResponse,
	IConsultationResponse,
	ICreateChildRequest,
	ICreateChildResponse,
	ICreateConsultationRequest,
	ICreateConsultationResponse,
	ICreateFeedbackRequest,
	ICreateFeedbackResponse,
	ICreateInquiryRequest,
	ICreateInquiryResponse,
	IFollowUpResponse,
	IInvitation,
	ILabResultsResponse,
	IMessageResponse,
	INationalIdResponse,
	IPatientResponse,
	IPrescriptionResponse,
	IProfileResponse,
	IProviderResponse,
	IProvidersResponse,
	IReceiptResponse,
	ISummaryResponse,
	IUpdateChildRequest,
	IUpdateChildResponse,
	IUpdateChildStatusRequest,
	IUpdatePatientResponse,
	IUpdateVitalDetailsResponse,
	IVerifyPaymentRequest,
	IVerifyPaymentResponse,
	IVitalsResponse,
} from './types';
import axiosApi from './';

const userId = Cookies.get('PATIENT_userId');
const api = axiosApi();

export const routes = {
	getProfile: async () => {
		const { data } = await api.get<IProfileResponse>(
			`/v1/users/profile/${userId}`
		);
		return data;
	},
	getProvider: async () => {
		const { data } = await api.get<IProviderResponse>(
			'/v1/patients/provider/information/1'
		);
		return data;
	},
	getProviders: async () => {
		const { data } = await api.get<IProvidersResponse[]>(
			'/v1/providers/headers'
		);
		return data;
	},
	getNationalId: async (nationalId: string) => {
		const { data } = await api.get<INationalIdResponse>(
			`/v1/patients/is-national-id/${nationalId}`
		);
		return data;
	},
	getPatient: async () => {
		const { data } = await api.get<IPatientResponse>(
			`/v1/users/profile/${userId}`
		);
		return data;
	},
	updatePatient: async (payload: IPatientResponse) => {
		const formData = new FormData();
        Object.keys(payload).forEach((key) => {
            if(payload[key] == null && key == 'ninCard') {} else {
                formData.append(key, payload[key]);
            }
        });
        const { data } = await api.put<IUpdatePatientResponse>(
            `/v1/patients/profile/edit/${userId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return data;
	},
	updateLocal: async (payload: IPatientResponse) => {
		const { data } = await api.put<IPatientResponse>(
			`/v1/patients/profile/edit/locale/${userId}`,
			payload
		);
		return data;
	},
	
	completeProfile: async (payload: ICompleteProfileRequest) => {
		const { data } = await api.put<ICompleteProfileResponse>(
			`/v1/patients/profile/complete/${userId}`,
			payload
		);
		return data;
	},
	getChildren: async () => {
		const { data } = await api.get<IChildrenResponse[]>(
			`/v1/child`
		);
		return data;
	},
	getActiveChildren: async () => {
		const { data } = await api.get<IChildrenResponse[]>(
			`/v1/child/active`
		);
		return data;
	},
	getChild: async (childId?: number) => {
		const { data } = await api.get<IChildrenResponse>(
			`/v1/child/${childId}`
		);
		return data;
	},
	createChild: async (payload: ICreateChildRequest) => {
        const formData = new FormData();
		
        Object.keys(payload).forEach((key) => {
            if(payload[key] == null && key == 'NINCard') {} else {
                formData.append(key, payload[key]);
            }
        });
        const { data } = await api.post<ICreateChildResponse>(
            `/v1/child`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return data;
    },
    updateChildStatus: async (payload: IUpdateChildStatusRequest) => {
		const { data } = await api.put<IUpdateChildResponse>(
			`/v1/child/status`,
			payload
		);
		return data;
	},
	updateChild: async (payload: IUpdateChildRequest) => {
        const { data } = await api.put<IUpdateChildResponse>(
            `/v1/child`,
            payload
        );
        return data;
    },
	getConsultation: async (consultationId?: number) => {
		const { data } = await api.get<IConsultationResponse>(
			`/v1/consultations/${consultationId}`
		);
		return data;
	},
	createConsultation: async (payload: ICreateConsultationRequest) => {
		const { data } = await api.post<ICreateConsultationResponse>(
			'/v1/consultations/create',
			payload
		);
		return data;
	},
	cancelConsultation: async (consultationId?: number) => {
		const { data } = await api.put<ICancelConsultationResponse>(
			`/v1/consultations/cancel/${consultationId}`
		);
		return data;
	},
	getConsultationPrice: async (priceListName: string) => {
		const { data } = await api.get<{
			price: number;
			duration: number;
		}>(`/v1/payout/price?priceListName=${priceListName}`);
		return data;
	},
	getVideoToken: async (consultationId?: number) => {
		const { data } = await api.get<{ token: string }>(
			`/v1/consultations/video-token/${consultationId}`
		);
		return data;
	},
	getPrescriptions: async () => {
		const { data } = await api.get<IPrescriptionResponse[]>(
			`/v1/consultations/prescriptions/patient/${userId}`
		);
		return data;
	},
	getPrescription: async (prescriptionId: number) => {
		const { data } = await api.get<IPrescriptionResponse>(
			`/v1/consultations/prescription/${prescriptionId}`
		);

		return data as IPrescriptionResponse;
	},
	getPrescriptionsByConsultation: async (consultationId?: number) => {
		const { data } = await api.get<IPrescriptionResponse[]>(
			`/v1/consultations/summary/prescription/${consultationId}?patientId=${userId}`
		);
		return data;
	},
	getVitals: async () => {
		const { data } = await api.get<IVitalsResponse>(
			`/v1/patients/vitals/${userId}`
		);
		return data;
	},
	getChildVitals: async (childId: number) => {
		const { data } = await api.get<IVitalsResponse>(
			`/v1/child/vitals/${userId}/${childId}`
		);
		return data;
	},
	updateVitalDetails: async (payload: any) => {
		// TODO: add type
		const { data } = await api.post<IUpdateVitalDetailsResponse>(
			`/v1/vitals/create/${userId}`,
			payload
		);
		return data;
	},
	getMessages: async () => {
		const { data } = await api.get<IMessageResponse[]>(
			`/v1/messages/user?userId=${userId}`
		);
		return data;
	},
	getMessage: async (messageId?: number) => {
		const { data } = await api.get<IMessageResponse>(
			`/v1/messages/message/${messageId}`
		);
		return data;
	},
	verifyPayment: async (payload: IVerifyPaymentRequest) => {
		const { data } = await api.post<IVerifyPaymentResponse>(
			'/v1/consultations/verify-payment',
			payload
		);
		return data;
	},
	createFeedback: async (payload: ICreateFeedbackRequest) => {
		const { data } = await api.put<ICreateFeedbackResponse>(
			`/v1/consultations/rate?consultationId=${payload.consultationId}&rating=${payload.rating}`
		);
		return data;
	},
	createInquiry: async (payload: ICreateInquiryRequest) => {
		const { data } = await api.post<ICreateInquiryResponse>(
			'/v1/inquiries/create/',
			payload
		);
		return data;
	},
	getSummaries: async () => {
		const { data } = await api.get<ISummaryResponse[]>(
			`/v1/consultations/summary/all/${userId}`
		);
		return data;
	},
	getSummary: async (consultationId?: number) => {
		const { data } = await api.get<ISummaryResponse>(
			`/v1/consultations/summary/${consultationId}`
		);
		return data;
	},
	getLabResults: async (consultationId?: number) => {
		const { data } = await api.get<ILabResultsResponse[]>(
			`/v1/consultations/summary/labrequest/${consultationId}`
		);
		return data;
	},
	getReceipt: async (consultationId?: number) => {
		const { data } = await api.get<IReceiptResponse>(
			`/v1/consultations/summary/receipt/${consultationId}`
		);
		return data;
	},
	getFollowUp: async (consultationId?: number) => {
		const { data } = await api.get<IFollowUpResponse>(
			`/v1/consultations/summary/followup/${consultationId}?patientId=${userId}`
		);
		return data;
	},
	getInvitations: async () => {
		const { data } = await api.get<IInvitation[]>(
			`/v1/invitations/users/${userId}`
		);
		return data;
	},
	createInvitation: async (payload: { name: string; email: string }) => {
		const { data } = await api.post<IInvitation>(
			'/v1/invitations/create',
			payload
		);
		return data;
	},
	resendInvitation: async (invitationId: number) => {
		const { data } = await api.post<IInvitation>(
			`/v1/invitations/resend/${invitationId}`
		);
		return data;
	},
	removeInvitation: async (invitationId: number) => {
		const { data } = await api.delete<IInvitation>(
			`/v1/invitations/delete/${invitationId}`
		);
		return data;
	},
	retainConsultation: async (consultationId: number) => {
		const { data } = await api.put<string>(
			`/v1/consultations/retain/${consultationId}`
		);
		return data;
	},
	getUserByEmail: async (email?: string) => {
        const { data } = await api.get<IProfileResponse>(
            `/v1/users/getUserByEmail/${email}`
        );
        return data;
    },
};