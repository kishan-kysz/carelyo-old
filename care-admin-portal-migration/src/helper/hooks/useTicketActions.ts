import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	assignTicket,
	updateTicketCategory,
	updateTicketType,
	updateTicketPriority,
	updateTicketStatus,
	unAssignTicket,
	addTicketTag,
	removeTicketTag
} from '../api/index';

const useTicketActions = () => {
	const queryClient = useQueryClient();
	const [loading, setLoading] = useState(false);

	const { mutateAsync: assign, isLoading: loadingAssign } = useMutation(assignTicket, {
		onSuccess: ({ id }) => {
			queryClient.invalidateQueries({ queryKey: ['getTicketById', id] });
		},
		onError: (err) => {
			console.log(err);
		}
	});

	const { mutateAsync: unAssign, isLoading: loadingUnAssign } = useMutation(unAssignTicket, {
		onSuccess: ({ id }) => {
			queryClient.invalidateQueries({ queryKey: ['getTicketById', id] });
		},
		onError: (err) => {
			console.log(err);
		}
	});

	const { mutateAsync: addTag, isLoading: loadingAddTag } = useMutation(addTicketTag, {
		onSuccess: ({ id }) => {
			queryClient.invalidateQueries({ queryKey: ['getTicketById', id] });
		},
		onError: (err) => {
			console.log(err);
		}
	});

	const { mutateAsync: removeTag, isLoading: loadingRemoveTag } = useMutation(removeTicketTag, {
		onSuccess: ({ id }) => {
			queryClient.invalidateQueries({ queryKey: ['getTicketById', id] });
		},
		onError: (err) => {
			console.log(err);
		}
	});

	const { mutateAsync: updateCategory, isLoading: loadingCategory } = useMutation(updateTicketCategory, {
		onSuccess: ({ id }) => {
			queryClient.invalidateQueries({ queryKey: ['getTicketById', id] });
		},
		onError: (err) => {
			console.log(err);
		}
	});

	const { mutateAsync: updateType, isLoading: loadingType } = useMutation(updateTicketType, {
		onSuccess: ({ id }) => {
			queryClient.invalidateQueries({ queryKey: ['getTicketById', id] });
		},
		onError: (err) => {
			console.log(err);
		}
	});

	const { mutateAsync: updatePriority, isLoading: loadingPriority } = useMutation(updateTicketPriority, {
		onSuccess: ({ id }) => {
			queryClient.invalidateQueries({ queryKey: ['getTicketById', id] });
		},
		onError: (err) => {
			console.log(err);
		}
	});

	const { mutateAsync: updateStatus, isLoading: loadingStatus } = useMutation(updateTicketStatus, {
		onSuccess: ({ id }) => {
			queryClient.invalidateQueries({ queryKey: ['getTicketById', id] });
		},
		onError: (err) => {
			console.log(err);
		}
	});

	useEffect(() => {
		if (
			loadingAssign ||
			loadingCategory ||
			loadingUnAssign ||
			loadingAddTag ||
			loadingRemoveTag ||
			loadingType ||
			loadingPriority ||
			loadingStatus
		) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [
		loadingAssign,
		loadingCategory,
		loadingUnAssign,
		loadingAddTag,
		loadingRemoveTag,
		loadingType,
		loadingPriority,
		loadingStatus
	]);

	return {
		assign,
		unAssign,
		addTag,
		removeTag,
		updateCategory,
		updateType,
		updatePriority,
		updateStatus,
		loading
	};
};

export default useTicketActions;
