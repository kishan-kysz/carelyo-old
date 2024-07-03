import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
	// mobile: Yup.string().min(5, 'Mobile must be at least 5 characters!').required('Mobile is required!'),
});

export default validationSchema;
