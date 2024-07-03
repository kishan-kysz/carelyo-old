import 'little-state-machine';

declare module 'little-state-machine' {
	interface GlobalState {
		forms: {
			title?: string;
			nationalIdNumber?: string;
			firstName?: string;
			surName?: string;
			gender?: string;
			maritalStatus?: string;
			bloodType?: string;
			allergies?: string;
			medicalProblems?: string;
			disabilities?: string;
			address?: string;
			zipCode?: string;
			community?: string;
			city?: string;
			state?: string;
			country?: string;
			language?: string;
			preferredLanguage?: string;
			closestHospital?: string;
			dateOfBirth?: string;
		};
		consultation: {
			childId: number;
			isFollowUp: boolean;
			followUpCode: string;
			bodyArea: string[];
			textDetailedDescription: string;
			audioDetailedDescription: string;
			consent: boolean;
			amountPaid: number;
			language: string;
			priceListName: string;
			images: { encodedContent: string; objectName: string }[];
			bookingFor: 'patient' | 'child';
			consultationType: 'VIRTUAL' | 'PHYSICAL';
		};
		activeConsultation: {
			id: number;
			duration: number;
			status: string;
			timeBooked: string;
			transactionReference: string;
			transactionUrl: string;
		};
	}
}
