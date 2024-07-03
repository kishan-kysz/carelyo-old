import { GlobalState } from 'little-state-machine';

export const initialState: GlobalState = {
	forms: {},
	consultation: {
		childId: 0,
		isFollowUp: false,
		followUpCode: '',
		bodyArea: [],
		textDetailedDescription: '',
		audioDetailedDescription: '',
		consent: false,
		amountPaid: 0,
		bookingFor: 'patient',
		language: '',
		images: [],
		priceListName: '',
		consultationType: 'VIRTUAL',
	},
	activeConsultation: {
		id: 0,
		duration: 0,
		status: '',
		timeBooked: '',
		transactionReference: '',
		transactionUrl: '',
	},
};

export const setTarget = (
	state: GlobalState,
	payload: {
		bookingFor: 'patient' | 'child';
	}
) => {
	return {
		...state,
		consultation: {
			...state.consultation,
			bookingFor: payload.bookingFor,
		},
	};
};

export const setConsultationType = (
	state: GlobalState,
	payload: {
		consultationType: 'VIRTUAL' | 'PHYSICAL';
	}
) => {
	return {
		...state,
		consultation: {
			...state.consultation,
			consultationType: payload.consultationType,
		},
	};
};

export const setChildId = (
	state: GlobalState,
	payload: { childId: number }
) => {
	return {
		...state,
		consultation: {
			...state.consultation,
			childId: payload.childId,
		},
	};
};

export const addBodyArea = (
	state: GlobalState,
	payload: { bodyArea: string[] }
) => {
	return {
		...state,
		consultation: {
			...state.consultation,
			bodyArea: payload.bodyArea,
		},
	};
};

export const setTextDetailedDescription = (
	state: GlobalState,
	payload: {
		textDetailedDescription: string;
	}
) => {
	return {
		...state,
		consultation: {
			...state.consultation,
			textDetailedDescription: payload.textDetailedDescription,
		},
	};
};

export const setAudioDetailedDescription = (
	state: GlobalState,
	payload: {
		audioDetailedDescription: string;
	}
) => {
	return {
		...state,
		consultation: {
			...state.consultation,
			audioDetailedDescription: payload.audioDetailedDescription,
		},
	};
};

type ImageObject = { encodedContent: string; objectName: string };

export const setConsultationImage = (
	state: GlobalState,
	payload: { images: ImageObject[] }
) => {
	return {
		...state,
		consultation: {
			...state.consultation,
			images: payload.images,
		},
	};
};

export const setConsent = (
	state: GlobalState,
	payload: {
		consent: boolean;
	}
) => {
	return {
		...state,
		consultation: {
			...state.consultation,
			consent: payload.consent,
		},
	};
};

export const setAmountPaid = (
	state: GlobalState,
	payload: {
		amountPaid: number;
		priceListName: string;
	}
) => {
	return {
		...state,
		consultation: {
			...state.consultation,
			amountPaid: payload.amountPaid,
			priceListName: payload.priceListName,
		},
	};
};

export const setActiveConsultation = (
	state: GlobalState,
	payload: {
		id: number;
		duration: number;
		status: string;
		timeBooked: string;
		transactionReference: string;
		transactionUrl: string;
	}
) => {
	return {
		...state,
		activeConsultation: {
			...payload,
		},
	};
};

export const setResetConsultation = (state: GlobalState) => {
	return {
		...state,
		consultation: {
			...initialState.consultation,
		},
		activeConsultation: {
			...initialState.activeConsultation,
		},
	};
};
