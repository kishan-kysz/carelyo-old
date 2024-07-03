import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
	email: Yup.string().required('Email is required!').email('Email is not valid!'),
	mobile: Yup.string().min(5, 'Mobile must be at least 5 characters!').required('Mobile is required!'),
	firstName: Yup.string().required('First name is required!'),
	lastName: Yup.string().required('Last name is required!'),
	mdcn: Yup.string()
		.matches(/^[0-9]+$/, 'Must be only digits!')
		.min(5, 'Must be exactly 5 digits!')
		.max(5, 'Must be exactly 5 digits!')
		.required('Mdcn is required!'),
	mdcIssuedDate: Yup.date().required('Issued date is required'),
	mdcExpirationDate: Yup.date()
		.required('Expiration date is required')
		.when('mdcIssuedDate', (mdcIssuedDate, schema) => {
			if (mdcIssuedDate !== undefined) {
				const mdcIssuedDatePlusOneDay: Date = new Date(mdcIssuedDate);
				mdcIssuedDatePlusOneDay.setTime(mdcIssuedDatePlusOneDay.getTime() + 1);
				return schema.min(mdcIssuedDatePlusOneDay, 'Expiration date must be after issued date!');
			}

			return schema;
		})
		.when('mdcIssuedDate', (mdcIssuedDate, schema) => {
			if (mdcIssuedDate !== undefined && mdcIssuedDate instanceof Date) {
				const mdcIssuedDatePlusOneYear = new Date(mdcIssuedDate);
				mdcIssuedDatePlusOneYear.setFullYear(mdcIssuedDatePlusOneYear.getFullYear() + 1);
				if (mdcIssuedDate.getDate() === 29 && mdcIssuedDate.getMonth() === 1) {
					mdcIssuedDatePlusOneYear.setDate(mdcIssuedDatePlusOneYear.getDate() - 1);
				}
				return schema.max(
					mdcIssuedDatePlusOneYear,
					'Expiration date cannot be set over one year after the issued date!'
				);
			}

			return schema;
		}),
	hospital: Yup.string().required('Hospital name is required!'),
	nationalIdNumber: Yup.string()
		.matches(/^[0-9]+$/, 'Must be only digits!')
		.min(11, 'Must be exactly 11 digits!')
		.max(11, 'Must be exactly 11 digits!')
		.required('National id number is required!')
});

export default validationSchema;
