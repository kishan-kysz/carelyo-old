import * as yup from 'yup';

const validationSchema = yup.object().shape({
	name: yup.string().required('Name is required!'),
	// price: yup
	// 	.string()
	// 	.required('Price is required!')
	// 	.test('priceMustBeANumber', 'Price must be a number!', (value) => {
	// 		return !isNaN(Number(value));
	// 	})
	// 	.test('priceHasMaximumTwoDecimals', 'Price can only contain two decimals!', (value) => {
	// 		if (value !== undefined && Math.floor(Number(value)) !== Number(value)) {
	// 			if (value.includes('.')) {
	// 				return value.toString().split('.')[1].length <= 2;
	// 			}
	// 		}
	// 		return true;
	// 	})
	// 	.test('priceMustBeAPositiveNumber', 'Price must be a positive number!', (value) => {
	// 		return Number(value) >= 0;
	// 	}),
	vat: yup
		.string()
		.required('VAT is required!')
		.test('vatMustBeANumber', 'VAT must be a number!', (value) => {
			return !isNaN(Number(value));
		})
		.test('vatMustBeAPositiveNumber', 'VAT must be a positive number!', (value) => {
			return Number(value) >= 0;
		}),
	commission: yup
		.string()
		.required('Commission is required!')
		.test('commissionMustBeANumber', 'Commission must be a number!', (value) => {
			return !isNaN(Number(value));
		})
		.test('commissionMustBeAPositiveNumber', 'Commission must be a positive number!', (value) => {
			return Number(value) >= 0;
		}),
	duration: yup
		.string()
		.required('Duration is required!')
		.test('durationMustBeANumber', 'Duration must be a number!', (value) => {
			return !isNaN(Number(value));
		})
		.test('durationMustBeAPositiveNumber', 'Duration must be a positive number!', (value) => {
			return Number(value) >= 0;
		})
});

export default validationSchema;
