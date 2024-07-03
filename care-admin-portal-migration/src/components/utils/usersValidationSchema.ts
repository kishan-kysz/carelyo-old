import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
	email: Yup.string().required('Email is required!').email('Email is not valid!'),
	mobile: Yup.string().min(5, 'Mobile must be at least 5 characters!').required('Mobile is required!'),
	firstName: Yup.string().required('First name is required!'),
	lastName: Yup.string().required('Last name is required!'),
	password: Yup.string()
		.matches(/[0-9]/, 'Must include number')
		.matches(/[a-z]/, 'Must include lowercase letter')
		.matches(/[A-Z]/, 'Must include uppercase letter')
		.matches(/[$&+,:;=?@#|'<>.^*()%!-]/, 'Must include special symbol')
		.min(6, 'Must be at least 6 characters')
		.max(20, 'Must be at most 20 characters')
		.required('Password is required!')
});

export default validationSchema;
