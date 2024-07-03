import { useQuery } from '@tanstack/react-query';
import { routes } from '../api/routes';
import { sortByDate } from '../utils';

const useMessages = () => {
	const { data, isLoading, error, isFetched } = useQuery(
		['getMessages'],
		routes.getMessages
	);
	const getMessageById = (messageId: number) => {
		return data?.find((m) => m.id === messageId);
	};
	const fetchMessageByID = (messageId: number) =>
		useQuery(['getMessageById', messageId], () => getMessageById(messageId));

	return {
		messages: data?.sort((a, b) => sortByDate(a.createdAt, b.createdAt)),
		fetchMessageByID,
		isLoading,
		isFetched,
		error,
	};
};

export default useMessages;
