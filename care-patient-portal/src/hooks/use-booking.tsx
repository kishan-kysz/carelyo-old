import {
	createContext,
	ReactNode,
	useContext,
	useMemo,
	useReducer,
	useRef,
} from 'react';
import { ICreateConsultationRequest } from '../api/types';

type Booking = {
	childId: number;
	bookingFor: 'patient' | 'child';
	isFollowUp: boolean;
	duration: number;
	audioDetailedDescription: string;
} & Omit<ICreateConsultationRequest, 'audioDetailedDescription'>;
type BookingContextType = {
	booking: Booking;
	actions: {
		handleAddFor: (forWho: Booking['bookingFor']) => void;
		handleAddType: (type: Booking['consultationType']) => void;
		handleAddPainPoints: (painPoints: Booking['bodyArea']) => void;
		handleAddAudioRecording: (
			audioRecording: Booking['audioDetailedDescription']
		) => void;
		handleAddImages: (images: Booking['images']) => void;
		handleAddNotes: (notes: Booking['textDetailedDescription']) => void;
		handleAddIsFollowUp: (isFollowUp: Booking['isFollowUp']) => void;
		handleAddChild: (childId: number) => void;
		handleAmountPaid: (amount: number, priceListName: string) => void;
		handleAddDuration: (duration: number) => void;
		reset: () => void;
	};
};
const BookingContext = createContext<BookingContextType | undefined>(undefined);
const initialBooking = {} as Booking;
export const BookingProvider = ({ children }: { children: ReactNode }) => {
	const [booking, dispatch] = useReducer(bookingReducer, initialBooking);

	function handleAddFor(forWho: Booking['bookingFor']) {
		return dispatch({
			type: 'add-for',
			payload: forWho,
		});
	}

	function handleAddType(type: Booking['consultationType']) {
		return dispatch({
			type: 'add-type',
			payload: type,
		});
	}

	function handleAddPainPoints(painPoints: Booking['bodyArea']) {
		return dispatch({
			type: 'add-pain-points',
			payload: painPoints,
		});
	}

	function handleAddAudioRecording(
		audioRecording: Booking['audioDetailedDescription']
	) {
		return dispatch({
			type: 'add-audio-recording',
			payload: audioRecording,
		});
	}

	function handleAddImages(images: Booking['images']) {
		return dispatch({
			type: 'add-images',
			payload: images,
		});
	}

	function handleAddNotes(notes: Booking['textDetailedDescription']) {
		return dispatch({
			type: 'add-notes',
			payload: notes,
		});
	}

	function handleAddIsFollowUp(isFollowUp: Booking['isFollowUp']) {
		return dispatch({
			type: 'add-is-follow-up',
			payload: isFollowUp,
		});
	}

	function handleAddChild(childId: number) {
		return dispatch({
			type: 'add-child',
			payload: childId,
		});
	}

	const handleAmountPaid = (amount: number, priceListName: string) => {
		return dispatch({
			type: 'add-amount-paid',
			payload: {
				amountPaid: amount,
				priceListName: priceListName,
			},
		});
	};
	const handleAddDuration = (duration: number) => {
		return dispatch({
			type: 'add-duration',
			payload: duration,
		});
	};
	const reset = () => {
		return dispatch({
			type: 'reset',
			payload: initialBooking,
		});
	};
	const actions = useRef({
		handleAddFor,
		handleAddType,
		handleAddPainPoints,
		handleAddAudioRecording,
		handleAddImages,
		handleAddNotes,
		handleAddDuration,
		handleAddIsFollowUp,
		handleAddChild,
		handleAmountPaid,
		reset,
	});

	const value = useMemo(
		() => ({ booking, actions: actions.current }),
		[booking, actions]
	);

	return (
		<BookingContext.Provider value={value}>{children}</BookingContext.Provider>
	);
};

type BookingActions =
	| 'add-for'
	| 'add-type'
	| 'add-amount-paid'
	| 'add-pain-points'
	| 'add-audio-recording'
	| 'add-images'
	| 'add-notes'
	| 'add-is-follow-up'
	| 'add-duration'
	| 'add-child'
	| 'reset'

const bookingReducer = (
	state: Booking,
	action: {
		type: BookingActions;
		payload: any;
	}
) => {
	switch (action.type) {
		case 'add-for':
			return { ...state, bookingFor: action.payload };
		case 'add-type':
			return { ...state, consultationType: action.payload };
		case 'add-pain-points':
			return { ...state, bodyArea: action.payload };
		case 'add-audio-recording':
			return { ...state, audioDetailedDescription: action.payload };
		case 'add-images':
			return { ...state, images: action.payload };
		case 'add-notes':
			return { ...state, textDetailedDescription: action.payload };
		case 'add-is-follow-up':
			return { ...state, isFollowUp: action.payload };
		case 'add-child':
			return { ...state, childId: action.payload };
		case 'add-amount-paid':
			return {
				...state,
				amountPaid: action.payload.amountPaid,
				priceListName: action.payload.priceListName,
			};
		case 'add-duration':
			return { ...state, duration: action.payload };
		default:
			return state;
	}
};

export const useBooking = () => {
	const context = useContext(BookingContext);
	if (context === undefined) {
		throw new Error('useBooking must be used within a BookingProvider');
	}
	return context;
};
