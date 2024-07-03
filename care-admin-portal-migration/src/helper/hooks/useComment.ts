import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddCommentToTicket, deleteAComment, updateAComment } from '../api';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';

const useComment = (ticketId: number | undefined) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();
	const queryClient = useQueryClient();

	const { mutateAsync: addComment, isLoading: addCommentLoader } = useMutation(
		(values: {
			ticketId: number | undefined;
			message: string;
		}) => AddCommentToTicket(values),
		{
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['getTicketById', ticketId] });
				showNotification({
					title: 'Comment has been added',
					message: ''
				});
			},
			onError: (err: ErrorOptions) => {
				console.log(err);
			}
		}
	);

	const {
		mutateAsync: deleteComment,
		isLoading: deleteLoader,
		isError
	} = useMutation(deleteAComment, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getTicketById', ticketId] });
			showNotification({
				title: 'Comment deleted',
				message: ''
			});
		},
		onError: (err: ErrorOptions) => {
			console.log(err);
		}
	});

	const { mutateAsync: updateComment, isLoading: updateCommentLoader } = useMutation(
		(values: {
			commentId: number;
			ticketId: number;
			message: string;
		}) => updateAComment(values),
		{
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['getTicketById', ticketId] });
				showNotification({
					title: 'Comment has been updated',
					message: ''
				});
			},
			onError: (err: ErrorOptions) => {
				console.log(err);
			}
		}
	);

	useEffect(() => {
		if (addCommentLoader || deleteLoader || updateCommentLoader) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [addCommentLoader, deleteLoader, updateCommentLoader]);

	return {
		addComment,
		deleteComment,
		updateComment,
		loading
	};
};

export default useComment;
