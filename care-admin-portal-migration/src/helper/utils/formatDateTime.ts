export const formatDateTime = (string: string) => {
	const dateTimeString = string.replace('T', ' ').slice(0, 16);
	const dateString = string.slice(0, 10);
	return { dateTimeString, dateString };
};
