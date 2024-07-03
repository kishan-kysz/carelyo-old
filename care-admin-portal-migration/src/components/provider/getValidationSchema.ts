
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
	email: Yup.string().required('Email is required!').email('Email is not valid!'),
/* 	isMobileValid: Yup.boolean().isTrue('Phone number is not valid!'), */
	phoneNumber: Yup.string().required('Phone number is required!'),
	providerName: Yup.string().required('Provider name is required!'),
	address: Yup.string().required('Address is required!'),
	webPageUrl: Yup.string().required('Website Url is required!'),
	secondaryEmail: Yup.string().email('Email is not valid!'),
	practiceNumber: Yup.string().matches(/^[0-9]+$/, 'Must be only digits!').required('Practice number is required!'),
	country: Yup.string().required('Country is required!'),
	currency: Yup.string().required('Currency is required!'),
	logoURL: Yup.string().required('Url for logo/image is required!'),
	providerType: Yup.string().required('Provider type is required!')
});

export default validationSchema;
