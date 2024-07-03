import { useState } from 'react';
import { AnyObject } from 'yup';
export interface IPatientValues {
	userId: number;
	email: string;
	mobile: string;
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
	polygenic: {
		heightCm: number;
		weightKg: number;
		gender: string;
		bloodType: string;
	};
	allergies: string[];
	medicalProblems: string[];
	disabilities: string[];
	location: {
		address: string;
		zipCode: number;
		community: string;
		city: string;
		state: string;
		country: string;
	};
	locale: {
		languages: string[];
		preferredLanguage: string;
		closestHospital: string;
	};
	referralCode: string;
	referralCount: number;
	providerId: number;
	isMobileValid: boolean;
}
export const usePatientValues = () => {
	const [initialValues, setInitialPatientValues] = useState<IPatientValues>({
		userId: 0,
		email: '',
		mobile: '',
		profileComplete: false,
		patientId: 0,
		title: '',
		nationalIdNumber: '',
		firstName: '',
		surName: '',
		dateOfBirth: new Date(),
		maritalStatus: '',
		hasChildren: false,
		numOfChildren: 0,
		polygenic: {
			heightCm: 0,
			weightKg: 0,
			gender: '',
			bloodType: ''
		},
		allergies: [],
		medicalProblems: [],
		disabilities: [],
		location: {
			address: '',
			zipCode: 0,
			community: '',
			city: '',
			state: '',
			country: ''
		},
		locale: {
			languages: [],
			preferredLanguage: '',
			closestHospital: ''
		},
		referralCode: '',
		referralCount: 0,
		providerId: 0,
		isMobileValid: false
	});

	const [patientValues, setCurrentPatientValues] = useState<IPatientValues>({
		userId: 0,
		email: '',
		mobile: '',
		profileComplete: false,
		patientId: 0,
		title: '',
		nationalIdNumber: '',
		firstName: '',
		surName: '',
		dateOfBirth: new Date(),
		maritalStatus: '',
		hasChildren: false,
		numOfChildren: 0,
		polygenic: {
			heightCm: 0,
			weightKg: 0,
			gender: '',
			bloodType: ''
		},
		allergies: [],
		medicalProblems: [],
		disabilities: [],
		location: {
			address: '',
			zipCode: 0,
			community: '',
			city: '',
			state: '',
			country: ''
		},
		locale: {
			languages: [],
			preferredLanguage: '',
			closestHospital: ''
		},
		referralCode: '',
		referralCount: 0,
		providerId: 0,
		isMobileValid: false
	});

	const setPatientValues = (action: setPatientValueActions, payload?: AnyObject) => {
		switch (action) {
			case setPatientValueActions.SET_EMAIL:
				if (payload?.email !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						email: payload.email
					}));
				}
				break;
			case setPatientValueActions.SET_MOBILE:
				if (payload?.mobile !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						mobile: payload.mobile
					}));
				}
				break;
			/* case setPatientValueActions.SET_IS_MOBILE_VALID:
				if (payload?.isMobileValid !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						isMobileValid: payload.isMobileValid
					}));
				}
				break; */
			case setPatientValueActions.SET_PROFILE_COMPLETE:
				if (payload?.profileComplete !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						profileComplete: payload.profileComplete
					}));
				}
				break;
			case setPatientValueActions.SET_TITLE:
				if (payload?.title !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						title: payload.title
					}));
				}
				break;
			case setPatientValueActions.SET_NATIONAL_ID_NUMBER:
				if (payload?.nationalIdNumber !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						nationalIdNumber: payload.nationalIdNumber
					}));
				}
				break;
			case setPatientValueActions.SET_FIRST_NAME:
				if (payload?.firstName !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						firstName: payload.firstName
					}));
				}
				break;
			case setPatientValueActions.SET_SUR_NAME:
				if (payload?.surName !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						surName: payload.surName
					}));
				}
				break;
			case setPatientValueActions.SET_DATE_OF_BIRTH:
				if (payload?.dateOfBirth !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						dateOfBirth: payload.dateOfBirth
					}));
				}
				break;
			case setPatientValueActions.SET_MARITAL_STATUS:
				if (payload?.maritalStatus !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						maritalStatus: payload.maritalStatus
					}));
				}
				break;
			case setPatientValueActions.SET_HAS_CHILDREN:
				if (payload?.hasChildren !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						hasChildren: payload.hasChildren
					}));
				}
				break;
			case setPatientValueActions.SET_NUM_OF_CHILDREN:
				if (payload?.numOfChildren !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						numOfChildren: payload.numOfChildren
					}));
				}
				break;
			case setPatientValueActions.SET_HEIGHT_CM:
				if (payload?.heightCm !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						polygenic: {
							...prevState.polygenic,
							heightCm: payload.heightCm
						}
					}));
				}
				break;
			case setPatientValueActions.SET_WEIGHT_KG:
				if (payload?.weightKg !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						polygenic: {
							...prevState.polygenic,
							weightKg: payload.weightKg
						}
					}));
				}
				break;
			case setPatientValueActions.SET_GENDER:
				if (payload?.gender !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						polygenic: {
							...prevState.polygenic,
							gender: payload.gender
						}
					}));
				}
				break;
			case setPatientValueActions.SET_BLOOD_TYPE:
				if (payload?.bloodType !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						polygenic: {
							...prevState.polygenic,
							bloodType: payload.bloodType
						}
					}));
				}
				break;

			case setPatientValueActions.SET_ALLERGIES:
				if (payload?.allergies !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						allergies: payload.allergies
					}));
				}
				break;

			case setPatientValueActions.SET_MEDICAL_PROBLEMS:
				if (payload?.medicalProblems !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,

						medicalProblems: payload.medicalProblems
					}));
				}
				break;

			case setPatientValueActions.SET_DISABILITIES:
				if (payload?.disabilities !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,

						disabilities: payload.disabilities
					}));
				}
				break;

			case setPatientValueActions.SET_ADDRESS:
				if (payload?.address !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						location: {
							...prevState.location,
							address: payload.address
						}
					}));
				}
				break;
			case setPatientValueActions.SET_CITY:
				if (payload?.city !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						location: {
							...prevState.location,
							city: payload.city
						}
					}));
				}
				break;

			case setPatientValueActions.SET_COMMUNITY:
				if (payload?.community !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						location: {
							...prevState.location,
							community: payload.community
						}
					}));
				}
				break;

			case setPatientValueActions.SET_COUNTRY:
				if (payload?.country !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						location: {
							...prevState.location,
							country: payload.country
						}
					}));
				}
				break;
			case setPatientValueActions.SET_ZIP_CODE:
				if (payload?.zipCode !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						location: {
							...prevState.location,
							zipCode: payload.zipCode
						}
					}));
				}
				break;

			case setPatientValueActions.SET_STATE:
				if (payload?.state !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						location: {
							...prevState.location,
							state: payload.state
						}
					}));
				}
				break;

			case setPatientValueActions.SET_LANGUAGES:
				if (payload?.languages !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						locale: {
							...prevState.locale,
							languages: payload.languages
						}
					}));
				}
				break;
			case setPatientValueActions.SET_PREFERRED_LANGUAGE:
				if (payload?.preferredLanguage !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						locale: {
							...prevState.locale,
							preferredLanguage: payload.preferredLanguage
						}
					}));
				}
				break;

			case setPatientValueActions.SET_CLOSEST_HOSPITAL:
				if (payload?.closestHospital !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						locale: {
							...prevState.locale,
							closestHospital: payload.closestHospital
						}
					}));
				}
				break;
			case setPatientValueActions.SET_REFERRAL_CODE:
				if (payload?.referralCode !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						locale: {
							...prevState.locale,
							referralCode: payload.referralCode
						}
					}));
				}
				break;
			case setPatientValueActions.SET_REFERRAL_COUNT:
				if (payload?.referralCount !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						locale: {
							...prevState.locale,
							referralCount: payload.referralCount
						}
					}));
				}
				break;
			case setPatientValueActions.SET_PROVIDER_ID:
				if (payload?.providerId !== undefined) {
					setCurrentPatientValues((prevState) => ({
						...prevState,
						providerId: payload.providerId
					}));
				}
				break;

			case setPatientValueActions.INIT:
				if (payload?.patient !== undefined) {
					setInitialPatientValues((prevState) => ({
						...prevState,
						email: payload.patient?.email !== undefined ? payload.patient?.email : '',
						mobile: payload.patient?.mobile !== undefined ? payload.patient?.mobile : '',
						title: payload.patient?.title !== undefined ? payload.patient?.title : '',
						firstName: payload.patient?.firstName,
						surName: payload.patient?.surName,
						dateOfBirth: payload.patient?.dateOfBirth,
						maritalStatus: payload.patient?.maritalStatus,
						hasChildren: payload.patient?.hasChildren,
						numOfChildren: payload.patient?.numOfChildren,
						polygenic: {
							heightCm: payload.patient?.polygenic?.heightCm,
							weightKg: payload.patient?.polygenic?.weightKg,
							gender: payload.patient?.polygenic?.gender,
							bloodType: payload.patient?.polygenic?.bloodType
						},
						allergies: payload.patient?.allergies,
						medicalProblems: payload.patient?.medicalProblems,
						disabilities: payload.patient?.disabilities,
						location: {
							address: payload.patient?.location?.address,
							zipCode: payload.patient?.location?.zipCode,
							community: payload.patient?.location?.community,
							city: payload.patient?.location?.city,
							state: payload.patient?.location?.state,
							country: payload.patient?.location?.country
						},
						locale: {
							languages: payload.patient?.locale?.languages,
							preferredLanguage: payload.patient?.locale?.preferredLanguage,
							closestHospital: payload.patient?.locale?.closestHospital,
							referralCode: payload.patient?.locale?.referralCode,
							referralCount: payload.patient?.locale?.referralCount
						},
						providerId: payload.patient?.providerId
					}));

					setCurrentPatientValues((prevState) => ({
						...prevState,
						email: payload.patient?.email !== undefined ? payload.patient?.email : '',
						mobile: payload.patient?.mobile !== undefined ? payload.patient?.mobile : '',
						title: payload.patient?.title || '',
						firstName: payload.patient?.firstName || '',
						surName: payload.patient?.surName || '',
						dateOfBirth: payload.patient?.dateOfBirth || '',
						maritalStatus: payload.patient?.maritalStatus || '',
						hasChildren: payload.patient?.hasChildren || '',
						numOfChildren: payload.patient?.numOfChildren || '',
						polygenic: {
							heightCm: payload.patient?.polygenic?.heightCm || '',
							weightKg: payload.patient?.polygenic?.weightKg || '',
							gender: payload.patient?.polygenic?.gender || '',
							bloodType: payload.patient?.polygenic?.bloodType || ''
						},
						allergies: payload.patient?.allergies || '',
						medicalProblems: payload.patient?.medicalProblems || '',
						disabilities: payload.patient?.disabilities || '',
						location: {
							address: payload.patient?.location?.address || '',
							zipCode: payload.patient?.location?.zipCode || '',
							community: payload.patient?.location?.community || '',
							city: payload.patient?.location?.city || '',
							state: payload.patient?.location?.state || '',
							country: payload.patient?.location?.country || ''
						},
						locale: {
							languages: payload.patient?.locale?.languages || [],
							preferredLanguage: payload.patient?.locale?.preferredLanguage || '',
							closestHospital: payload.patient?.locale?.closestHospital || '',
							referralCode: payload.patient?.locale?.referralCode || '',
							referralCount: payload.patient?.locale?.referralCount || ''
						},
						providerId: payload.patient?.providerId
					}));
				}
				break;
			case setPatientValueActions.RESET:
				setCurrentPatientValues(initialValues);
				break;
			default:
				break;
		}
	};

	return { setPatientValues, patientValues };
};

export enum setPatientValueActions {
	SET_EMAIL = 'SET_EMAIL',
	SET_MOBILE = 'SET_MOBILE',
	SET_IS_MOBILE_VALID = 'SET_IS_PHONE_INPUT_VALID',
	SET_PROFILE_COMPLETE = 'SET_PROFILE_COMPLETE',
	SET_TITLE = 'SET_TITLE',
	SET_NATIONAL_ID_NUMBER = 'SET_NATIONAL_ID_NUMBER',
	SET_FIRST_NAME = 'SET_FIRST_NAME',
	SET_SUR_NAME = 'SET_SUR_NAME',
	SET_DATE_OF_BIRTH = 'SET_DATE_OF_BIRTH',
	SET_MARITAL_STATUS = 'SET_MARITAL_STATUS',
	SET_HAS_CHILDREN = 'SET_HAS_CHILDREN',
	SET_NUM_OF_CHILDREN = 'SET_NUM_OF_CHILDREN',
	SET_HEIGHT_CM = 'SET_HEIGHT_CM',
	SET_WEIGHT_KG = 'SET_WEIGHT_KG',
	SET_GENDER = 'SET_GENDER',
	SET_BLOOD_TYPE = 'SET_BLOOD_TYPE',
	SET_ALLERGIES = 'SET_ALLERGIES',
	SET_MEDICAL_PROBLEMS = 'SET_MEDICAL_PROBLEMS',
	SET_DISABILITIES = 'SET_DISABILITIES',
	SET_ADDRESS = 'SET_ADDRESS',
	SET_ZIP_CODE = 'SET_ZIP_CODE',
	SET_COMMUNITY = 'SET_COMMUNITY',
	SET_CITY = 'SET_CITY',
	SET_STATE = 'SET_STATE',
	SET_COUNTRY = 'SET_COUNTRY',
	SET_LANGUAGES = 'SET_LANGUAGES',
	SET_PREFERRED_LANGUAGE = 'SET_PREFERRED_LANGUAGE',
	SET_CLOSEST_HOSPITAL = 'SET_CLOSEST_HOSPITAL',
	SET_REFERRAL_CODE = 'SET_REFERRAL_CODE',
	SET_REFERRAL_COUNT = 'SET_REFERRAL_COUNT',
	SET_PROVIDER_ID = 'SET_PROVIDER_ID',
	INIT = 'INIT',
	RESET = 'RESET'
}
