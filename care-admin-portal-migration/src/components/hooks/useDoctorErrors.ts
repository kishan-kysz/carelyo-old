import { useState } from 'react';
import { AnyObject } from 'yup';
import * as Yup from 'yup';
export const useDoctorErrors = () => {
	interface IDoctorErrors {
		backend: string[];
		email: string;
		mobile: string;
		firstName: string;
		lastName: string;
		mdcn: string;
		mdcIssuedDate: string;
		mdcExpirationDate: string;
		hospital: string;
		nationalIdNumber: string;
		providerId: string;
	}

	const initialDoctorErrors: IDoctorErrors = {
		backend: [],
		email: '',
		mobile: '',
		firstName: '',
		lastName: '',
		mdcn: '',
		mdcIssuedDate: '',
		mdcExpirationDate: '',
		hospital: '',
		nationalIdNumber: '',
		providerId: ''
	};

	const [doctorErrors, setCurrentDoctorErrors] = useState<IDoctorErrors>({
		backend: [],
		email: '',
		mobile: '',
		firstName: '',
		lastName: '',
		mdcn: '',
		mdcIssuedDate: '',
		mdcExpirationDate: '',
		hospital: '',
		nationalIdNumber: '',
		providerId: ''
	});

	const setDoctorErrors = (action: setDoctorErrorActions, payload?: AnyObject) => {
		switch (action) {
			case setDoctorErrorActions.SET_VALIDATION_ERROR_MESSAGES:
				if (payload?.validationErrors !== undefined) {
					setCurrentDoctorErrors((prevState) => ({
						...prevState,
						email: payload.validationErrors.email !== undefined ? payload.validationErrors.email[0] : '',
						mobile:
							payload.validationErrors.mobile !== undefined
								? payload.validationErrors.mobile[0]
								: payload.validationErrors.isMobileValid !== undefined
								? payload.validationErrors.isMobileValid[0]
								: '',
						firstName: payload.validationErrors.firstName !== undefined ? payload.validationErrors.firstName[0] : '',
						lastName: payload.validationErrors.lastName !== undefined ? payload.validationErrors.lastName[0] : '',
						mdcn: payload.validationErrors.mdcn !== undefined ? payload.validationErrors.mdcn[0] : '',
						mdcIssuedDate:
							payload.validationErrors.mdcIssuedDate !== undefined ? payload.validationErrors.mdcIssuedDate[0] : '',
						mdcExpirationDate:
							payload.validationErrors.mdcExpirationDate !== undefined
								? payload.validationErrors.mdcExpirationDate[0]
								: '',
						hospital: payload.validationErrors.hospital !== undefined ? payload.validationErrors.hospital[0] : '',
						nationalIdNumber:
							payload.validationErrors.nationalIdNumber !== undefined
								? payload.validationErrors.nationalIdNumber[0]
								: '',
						providerId: payload.validationErrors.providerId !== undefined ? payload.validationErrors.providerId[0] : ''
					}));
				}
				break;
			case setDoctorErrorActions.SET_RESPONSE_ERROR_MESSAGES:
				if (payload?.responseErrorMessages !== undefined) {
					setCurrentDoctorErrors({
						backend: payload.responseErrorMessages.backend,
						email: payload.responseErrorMessages.email,
						mobile: payload.responseErrorMessages.mobile,
						firstName: payload.responseErrorMessages.firstName,
						lastName: payload.responseErrorMessages.lastName,
						mdcn: payload.responseErrorMessages['medicalCertificate.certificateNumber'],
						mdcIssuedDate: payload.responseErrorMessages['medicalCertificate.issuedDate'],
						mdcExpirationDate: payload.responseErrorMessages['medicalCertificate.expirationDate'],
						hospital: payload.responseErrorMessages.hospital,
						nationalIdNumber: payload.responseErrorMessages.nationalIdNumber,
						providerId: payload.responseErrorMessages.providerId
					});
				}
				break;
			case setDoctorErrorActions.RESET:
				setCurrentDoctorErrors(initialDoctorErrors);
				break;
			default:
				break;
		}
	};

	return { doctorErrors, setDoctorErrors };
};

export enum setDoctorErrorActions {
	SET_VALIDATION_ERROR_MESSAGES = 'SET_VALIDATION_ERROR_MESSAGES',
	SET_RESPONSE_ERROR_MESSAGES = 'SET_RESPONSE_ERROR_MESSAGES',
	RESET = 'RESET'
}
