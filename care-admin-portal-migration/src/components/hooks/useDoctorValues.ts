import { useState } from 'react';
import { AnyObject } from 'yup';

export const useDoctorValues = () => {
	interface IDoctorValues {
		email: string;
		mobile: string;
		isMobileValid: boolean;
		firstName: string;
		lastName: string;
		mdcn: string;
		mdcIssuedDate: Date | undefined;
		mdcExpirationDate: Date | undefined;
		hospital: string;
		nationalIdNumber: string;
		providerId: string;
	}

	const [initialValues, setInitialDoctorValues] = useState<IDoctorValues>({
		email: '',
		mobile: '',
		isMobileValid: false,
		firstName: '',
		lastName: '',
		mdcn: '',
		mdcIssuedDate: undefined,
		mdcExpirationDate: undefined,
		hospital: '',
		nationalIdNumber: '',
		providerId: ''
	});

	const [doctorValues, setCurrentDoctorValues] = useState<IDoctorValues>({
		email: '',
		mobile: '',
		isMobileValid: false,
		firstName: '',
		lastName: '',
		mdcn: '',
		mdcIssuedDate: undefined,
		mdcExpirationDate: undefined,
		hospital: '',
		nationalIdNumber: '',
		providerId: ''
	});

	const setDoctorValues = (action: setDoctorValueActions, payload?: AnyObject) => {
		switch (action) {
			case setDoctorValueActions.SET_EMAIL:
				if (payload?.email !== undefined) {
					setCurrentDoctorValues((prevState) => ({
						...prevState,
						email: payload.email
					}));
				}
				break;
			case setDoctorValueActions.SET_MOBILE:
				if (payload?.mobile !== undefined) {
					setCurrentDoctorValues((prevState) => ({
						...prevState,
						mobile: payload.mobile
					}));
				}
				break;
			case setDoctorValueActions.SET_IS_MOBILE_VALID:
				if (payload?.isMobileValid !== undefined) {
					setCurrentDoctorValues((prevState) => ({
						...prevState,
						isMobileValid: payload.isMobileValid
					}));
				}
				break;
			case setDoctorValueActions.SET_FIRST_NAME:
				if (payload?.firstName !== undefined) {
					setCurrentDoctorValues((prevState) => ({
						...prevState,
						firstName: payload.firstName
					}));
				}
				break;
			case setDoctorValueActions.SET_LAST_NAME:
				if (payload?.lastName !== undefined) {
					setCurrentDoctorValues((prevState) => ({
						...prevState,
						lastName: payload.lastName
					}));
				}
				break;
			case setDoctorValueActions.SET_MDCN:
				if (payload?.mdcn !== undefined) {
					setCurrentDoctorValues((prevState) => ({
						...prevState,
						mdcn: payload.mdcn
					}));
				}
				break;
			case setDoctorValueActions.SET_MDC_ISSUED_DATE:
				if (payload?.mdcIssuedDate !== undefined) {
					setCurrentDoctorValues((prevState) => ({
						...prevState,
						mdcIssuedDate:
							typeof payload.mdcIssuedDate === 'number'
								? new Date(payload.mdcIssuedDate)
								: payload.mdcIssuedDate instanceof Date
								? payload.mdcIssuedDate
								: prevState.mdcIssuedDate
					}));
				}
				break;
			case setDoctorValueActions.SET_MDC_EXPIRATION_DATE:
				if (payload?.mdcExpirationDate !== undefined) {
					setCurrentDoctorValues((prevState) => ({
						...prevState,
						mdcExpirationDate:
							typeof payload.mdcExpirationDate === 'number'
								? new Date(payload.mdcExpirationDate)
								: payload.mdcExpirationDate instanceof Date
								? payload.mdcExpirationDate
								: prevState.mdcExpirationDate
					}));
				}
				break;
			case setDoctorValueActions.SET_HOSPITAL:
				if (payload?.hospital !== undefined) {
					setCurrentDoctorValues((prevState) => ({
						...prevState,
						hospital: payload.hospital
					}));
				}
				break;
			case setDoctorValueActions.SET_NATIONAL_ID_NUMBER:
				if (payload?.nationalIdNumber !== undefined) {
					setCurrentDoctorValues((prevState) => ({
						...prevState,
						nationalIdNumber: payload.nationalIdNumber
					}));
				}
				break;
			case setDoctorValueActions.SET_PROVIDER_ID:
				if (payload?.providerId !== undefined) {
					setCurrentDoctorValues((prevState) => ({
						...prevState,
						providerId: payload.providerId
					}));
				}
			case setDoctorValueActions.INIT:
				if (payload?.doctor !== undefined) {
					setInitialDoctorValues((prevState) => ({
						...prevState,
						email: payload.doctor.email !== undefined ? payload.doctor.email : '',
						mobile: payload.doctor.mobile !== undefined ? payload.doctor.mobile : '',
						firstName: payload.doctor.firstName !== undefined ? payload.doctor.firstName : '',
						lastName: payload.doctor.lastName !== undefined ? payload.doctor.lastName : '',
						mdcn:
							payload.doctor.medicalCertificate?.certificateNumber !== undefined
								? payload.doctor.medicalCertificate.certificateNumber.substring(7)
								: '',
						mdcIssuedDate:
							payload.doctor.medicalCertificate?.issuedDate !== undefined
								? new Date(payload.doctor.medicalCertificate.issuedDate)
								: undefined,
						mdcExpirationDate:
							payload.doctor.medicalCertificate?.expirationDate !== undefined
								? new Date(payload.doctor.medicalCertificate.expirationDate)
								: undefined,
						hospital: payload.doctor.hospital !== undefined ? payload.doctor.hospital : '',
						nationalIdNumber:
							payload.doctor.nationalIdNumber !== undefined ? payload.doctor.nationalIdNumber?.toString() : '',
						providerId: payload.doctor.providerId !== undefined ? payload.doctor.providerId : ''
					}));
					setCurrentDoctorValues((prevState) => ({
						...prevState,
						email: payload.doctor.email !== undefined ? payload.doctor.email : '',
						mobile: payload.doctor.mobile !== undefined ? payload.doctor.mobile : '',
						firstName: payload.doctor.firstName !== undefined ? payload.doctor.firstName : '',
						lastName: payload.doctor.lastName !== undefined ? payload.doctor.lastName : '',
						mdcn:
							payload.doctor.medicalCertificate?.certificateNumber !== undefined
								? payload.doctor.medicalCertificate.certificateNumber.substring(7)
								: '',
						mdcIssuedDate:
							payload.doctor.medicalCertificate?.issuedDate !== undefined
								? new Date(payload.doctor.medicalCertificate.issuedDate)
								: undefined,
						mdcExpirationDate:
							payload.doctor.medicalCertificate?.expirationDate !== undefined
								? new Date(payload.doctor.medicalCertificate.expirationDate)
								: undefined,
						hospital: payload.doctor.hospital !== undefined ? payload.doctor.hospital : '',
						nationalIdNumber:
							payload.doctor.nationalIdNumber !== undefined ? payload.doctor.nationalIdNumber?.toString() : '',
						providerId: payload.doctor.providerId !== undefined ? payload.doctor.providerId : ''
					}));
				}
				break;
			case setDoctorValueActions.RESET:
				setCurrentDoctorValues(initialValues);
				break;
			default:
				break;
		}
	};

	return { setDoctorValues, doctorValues };
};

export enum setDoctorValueActions {
	SET_EMAIL = 'SET_EMAIL',
	SET_MOBILE = 'SET_MOBILE',
	SET_IS_MOBILE_VALID = 'SET_IS_PHONE_INPUT_VALID',
	SET_FIRST_NAME = 'SET_FIRST_NAME',
	SET_LAST_NAME = 'SET_LAST_NAME',
	SET_MDCN = 'SET_MDCN',
	SET_MDC_ISSUED_DATE = 'SET_MDC_ISSUED_DATE',
	SET_MDC_EXPIRATION_DATE = 'SET_MDC_EXPIRATION_DATE',
	SET_HOSPITAL = 'SET_HOSPITAL',
	SET_NATIONAL_ID_NUMBER = 'SET_NATIONAL_ID_NUMBER',
	SET_PROVIDER_ID = 'SET_PROVIDER_ID',
	INIT = 'INIT',
	RESET = 'RESET'
}
