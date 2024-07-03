import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showNotification } from '@mantine/notifications';
import { routes } from '../api/routes';

export default function useInvitations() {
	const queryClient = useQueryClient();

	const { data: invitations } = useQuery(
		['invitations'],
		routes.getInvitations,
		{}
	);
	const { mutateAsync: add, isLoading: sendLoading } = useMutation(
		routes.createInvitation,
		{
			onSuccess: async (data) => {
				showNotification({
					id: 'add-invitation-success',
					title: 'Success',
					message: `Invitation sent to ${data.email}`,
				});
				await queryClient.invalidateQueries(['invitations']);
			},
			onError: async () => {
				showNotification({
					id: 'add-invitation-error',
					title: 'Error',
					message:
						'Invitation not sent, Make sure the email is correct and try again',
					color: 'red',
				});
			},
		}
	);
	const { mutateAsync: resend } = useMutation(routes.resendInvitation, {
		onSuccess: async () => {
			showNotification({
				id: 'resend-invitation-success',
				title: 'Success',
				message: 'Invitation delivered',
				color: 'yellow',
			});
		},
		onError: async () => {
			showNotification({
				id: 'resend-invitation-error',
				title: 'Error',
				message: 'Could not resend invitation, please try again later',
				color: 'red',
			});
		},
	});
	const { mutateAsync: remove } = useMutation(routes.removeInvitation, {
		onSuccess: async () => {
			showNotification({
				id: 'delete-invitation',
				title: 'Success',
				message: 'Invitation permanently deleted',
				color: 'orange',
			});
			await queryClient.invalidateQueries(['invitations']);
		},
		onError: async () => {
			showNotification({
				id: 'delete-invitation-error',
				title: 'Error',
				color: 'red',
				message: 'Could not delete invitation, please try again later',
			});
		},
	});
	return { invitations, add, sendLoading, resend, remove };
}
