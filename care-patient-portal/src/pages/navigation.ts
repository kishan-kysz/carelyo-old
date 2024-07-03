import { useNavigate } from 'react-router-dom';

export type AvailableRoutes =
	| 'booking'
	| 'call'
	| 'tr'
	| 'consultation'
	| 'consultations'
	| 'cookies'
	| 'feedback'
	| 'followup'
	| 'home'
	| 'lab'
	| 'tr'
	| 'history'
	| 'message'
	| 'messages'
	| 'prescription'
	| 'prescriptions'
	| 'privacy'
	| 'profile'
	| 'provider'
	| 'receipt'
	| 'services'
	| 'support'
	| 'termsConditions'
	| 'waitingroom'
	| 'invitations';

export const routes = {
	home: { path: '/', label: 'Home' },
	call: { path: '/call', label: 'Video Call' },
	booking: { path: '/booking', label: 'Book Appointment' },
	profile: { path: '/profile', label: 'Profile' },
	messages: { path: '/messages', label: 'Messages' },
	message: { path: '/messages/:messageId', label: 'Message' },
	completeprofile: { path: 'complete-profile', label: 'Complete Profile' },
	consultation: {
		path: '/services/consultations/:consultationId',
		label: 'Consultation Info',
	},
	consultations: {
		path: '/services/consultations',
		label: 'Consultation History',
	},
	cookies: { path: '/support/cookies', label: 'Cookies Policy' },
	feedback: { path: '/support/feedback', label: 'Feedback' },
	followup: { path: '/services/followup', label: 'Follow Up' },
	invitations: { path: '/services/invitations', label: 'Invitations' },
	lab: {
		path: '/services/consultations/:consultationId/lab',
		label: 'Lab Requests',
	},
	history: { path: '/services/history', label: 'Medical History' },
	prescription: {
		path: '/services/consultations/:consultationId/prescription/:id',
		label: 'Prescription Detail',
	},
	prescriptions: {
		path: '/services/prescriptions',
		label: 'Prescriptions',
	},
	privacy: { path: '/support/privacy', label: 'Privacy Policy' },
	provider: {
		path: '/provider',
		label: 'Healthcare Provider',
	},
	receipt: {
		path: '/services/consultations/:consultationId/receipt',
		label: 'Receipt',
	},
	services: { path: '/services', label: 'Services' },
	support: { path: '/support', label: 'Support' },
	termsConditions: {
		path: '/support/terms-conditions',
		label: 'Terms and Conditions',
	},
	waitingroom: { path: '/waitingroom', label: 'Waiting Room' },
	payment: { path: '/booking/payment', label: 'tr' },
};

export const getPath = (path: AvailableRoutes, params?: string[]) => {
	const route = routes[path];
	if (!route) {
		throw new Error(`Route ${path} not found`);
	}
	if (params) {
		let pathWithParams = route.path;
		params.forEach((param) => {
			pathWithParams = pathWithParams.replace(/:\w+/, param);
		});
		return pathWithParams;
	}
	return route.path;
};

export const useGuardedNavigation = () => {
	const goto = useNavigate();
	const navigate = (path: AvailableRoutes, params?: string[]) => {
		goto(getPath(path, params));
	};
	const back = () => {
		goto(-1);
	};
	return { navigate, back };
};