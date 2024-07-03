import { IErrorReponse } from '../utils/types';

export const getResponseErrorMessages = (errors: IErrorReponse[], invalidArgumentValues: string[]) => {
	const responseErrorMessages: Record<string, string | string[]> = {};
	const backendMessages: string[] = [];

	if (errors !== undefined) {
		errors.forEach((error: IErrorReponse) => {
			if (error.code === 'invalid_argument_value' && invalidArgumentValues.includes(error.field)) {
				invalidArgumentValues.forEach((errorField: string) => {
					if (errorField === error.field) {
						responseErrorMessages[errorField] = error.message.charAt(0).toUpperCase() + error.message.slice(1);
					}
				});
			} else {
				error.message !== undefined
					? backendMessages.push(error.message.charAt(0).toUpperCase() + error.message.slice(1))
					: backendMessages.push(`No message found for the error code: ${error.code}`);
			}
		});
	}

	invalidArgumentValues.forEach((invalidArgumentValue) => {
		if (!responseErrorMessages.hasOwnProperty(invalidArgumentValue)) {
			responseErrorMessages[invalidArgumentValue] = '';
		}
	});

	responseErrorMessages['backend'] = backendMessages;

	return responseErrorMessages;
};
