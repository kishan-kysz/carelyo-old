import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { routes } from '../api/routes';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { useStateMachine } from 'little-state-machine';
import { setResetConsultation } from '../consultation-state';
import { env } from '../utils/env';
import { useTranslation } from 'react-i18next';
import useProfile from './use-profile';

export const useConsultation = () => {
	const queryClient = useQueryClient();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);

	const { actions } = useStateMachine({ setResetConsultation });
	const { user } = useProfile();
	const { t } = useTranslation(['default']);
	const hasActiveConsultation =
		user?.activeConsultation !== null && !!user?.activeConsultation?.id;

	const {
		data: consultation,
		isInitialLoading: loadingConsultation,
		isError: errorConsultation,
	} = useQuery(
		['getConsultation', user?.activeConsultation?.id],
		() => routes.getConsultation(user?.activeConsultation?.id),
		{
			refetchInterval: env.VITE_POLLING_RATE,
			refetchIntervalInBackground: true,
			enabled: hasActiveConsultation,
		}
	);

	const {
		mutateAsync: createConsultation,
		isLoading: loadingCreateConsultation,
		isError: errorCreateConsultation,
	} = useMutation(routes.createConsultation, {
		onSuccess: () => {
			void queryClient.invalidateQueries(['getProfile']);
		},
		onError: () => {
			showNotification({
				title: t('tr.error'),
				message: t('tr.error-occured-booking'),
				color: 'red',
			});
		},
	});

	const {
		mutateAsync: cancelConsultation,
		isLoading: loadingCancelConsultation,
		isError: errorCancelConsultation,
	} = useMutation(routes.cancelConsultation, {
		onSuccess: (data) => {
			if (data) {
				showNotification({
					title: t('tr.consultation-canceled'),
					message: `${t('tr.your-paid-amount-of')}${data} ${t(
						'notifications.in-your-wallet'
					)}`,
					autoClose: 2500,
				});
			}
			actions.setResetConsultation();
		},
		onError: () => {
			showNotification({
				title: t('tr.something-went-wrong'),
				message: 'error.message', // TODO: TRANSLATE !!!
				autoClose: 2500,
				color: 'red',
			});
		},
	});
	const getConsultationById = (id: number) =>
		useQuery(['getConsultation', id], () => routes.getConsultation(id), {
			enabled: !!id,
		});

	const {
		data: videoToken,
		isInitialLoading: loadingVideoToken,
		isError: errorVideoToken,
	} = useQuery(
		['videoToken', user?.activeConsultation?.id, consultation?.roomName],
		() => routes.getVideoToken(user?.activeConsultation?.id),
		{
			enabled: hasActiveConsultation && !!consultation?.roomName,
		}
	);

	useEffect(() => {
		if (consultation?.status === 'accepted') {
			document.title = t('tr.call_accepted');
		}
		if (consultation?.status === 'started') {
			document.title = t('tr.call_started');
		}
		if (
			consultation?.status !== 'accepted' &&
			consultation?.status !== 'started'
		) {
			document.title = 'Carelyo';
		}
	}, [consultation?.status]);

	useEffect(() => {
		if (
			loadingConsultation ||
			loadingCreateConsultation ||
			loadingCancelConsultation ||
			loadingVideoToken
		) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [
		loadingConsultation,
		loadingCreateConsultation,
		loadingCancelConsultation,
		loadingVideoToken,
	]);

	useEffect(() => {
		if (
			errorConsultation ||
			errorCreateConsultation ||
			errorCancelConsultation ||
			errorVideoToken
		) {
			setError(true);
		} else {
			setError(false);
		}
	}, [
		errorConsultation,
		errorCreateConsultation,
		errorCancelConsultation,
		errorVideoToken,
	]);

	return {
		loading,
		error,
		consultation,
		getConsultationById,
		createConsultation,
		cancelConsultation,
		videoToken,
	};
};
