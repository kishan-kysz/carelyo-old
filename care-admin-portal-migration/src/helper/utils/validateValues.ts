import * as Yup from 'yup';
import { AnyObject } from 'yup';

export const validateValues = (values: object, validationSchema: Yup.AnyObjectSchema) => {
	return new Promise((resolve, reject) => {
		new Promise((resolve) => {
			resolve(validationSchema.isValid(values, { abortEarly: false }));
		}).then((isDataValid) => {
			if (isDataValid) {
				resolve(null);
			} else {
				new Promise((resolve) => {
					resolve(
						validationSchema.validate(values, { abortEarly: false }).catch((err) => {
							const errors = err.inner.reduce((acc: AnyObject, error: AnyObject) => {
								return {
									...acc,
									[error.path]: error.errors
								};
							}, {});

							return errors;
						})
					);
				}).then((errors) => {
					reject(errors);
				});
			}
		});
	});
};
