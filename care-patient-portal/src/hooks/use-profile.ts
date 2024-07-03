import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { routes } from '../api/routes';
import { logout } from '../utils/auth';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';

const useProfile = () => {
	const queryClient = useQueryClient();
	const { t } = useTranslation(['default']);

	const getUserByEmail = (email: string) => useQuery(
		['getUserByEmail'], () => 
			routes.getUserByEmail(email)
	);
	
	const {
		data: user,
		isLoading: userLoading,
		isError: userError,
	} = useQuery(['getProfile'], routes.getProfile, {
		onError: () => {
			logout();
		},
		retry: false,
	});

	const isProfileComplete = Boolean(user?.profileComplete);
	if (user && user.profilePhoto) {
		Cookies.set('profilePhoto', user.profilePhoto, { expires: 24 });
	}

	const { mutateAsync: updateProfile } = useMutation(routes.updatePatient, {
		onSuccess: async (data, variables) => {
			await queryClient.setQueryData(['getProfile'], data);
			const keys = Object.keys(variables);
			if (!(keys.length === 1 && keys.includes('locale'))) {
				showNotification({
					title: t('tr.success'),
					message: t('tr.profile-updated'),
				});
			}
		},
		onError: () => {
			showNotification({
				title: t('tr.failed-to-update-profile'),
				message: t('tr.something-went-wrong'),
			});
		},
	});

	const { mutateAsync: updateLocal } = useMutation(routes.updateLocal, {
		onSuccess: async (data, variables) => {
			await queryClient.setQueryData(['getProfile'], data);
			const keys = Object.keys(variables);
			if (!(keys.length === 1 && keys.includes('locale'))) {
				showNotification({
					title: t('tr.success'),
					message: t('tr.profile-updated'),
				});
			}
		},
		onError: () => {
			showNotification({
				title: t('tr.failed-to-update-profile'),
				message: t('tr.something-went-wrong'),
			});
		},
	});
	const { mutateAsync: completeProfile, isLoading } = useMutation(
		routes.completeProfile,
		{
			onSuccess: async (data) => {
				await queryClient.invalidateQueries(['getProfile'], data);
			},
			onError: () => {
				showNotification({
					title: t('tr.failed-to-update-profile'),
					message: t('tr.something-went-wrong'),
				});
			},
		}
	);

	return {
		user,
		userLoading,
		userError,
		isLoading,
		updateProfile,
		completeProfile,
		isProfileComplete,
		updateLocal,
		getUserByEmail,
	};
};

export default useProfile;
