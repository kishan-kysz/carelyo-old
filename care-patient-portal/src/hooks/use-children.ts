import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { routes } from '../api/routes';
import { showNotification } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';

const useChildren = (childId?: number) => {
	const queryClient = useQueryClient();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [hasChildren, setHasChildren] = useState<boolean>(false);
	const { t } = useTranslation(['default']);

	const {
		data: children,
		isLoading: loadingChildren,
		isError: errorChildren,
	} = useQuery(['getChildren'], routes.getChildren, {
		onSuccess: (data) => {
			setHasChildren(!!data.length);
		},
	});

	const {
		data: child
	} = useQuery(['getChild', childId],() => routes.getChild(childId), {
		enabled: !!childId,
	});

	const {
		data: activeChildren,
	} = useQuery(['getActiveChildren'], routes.getActiveChildren, {
		onSuccess: (data) => {
			setHasChildren(!!data.length);
		},
	});

	const getChildById = (id: number) =>
		useQuery(['getChild', id], () => routes.getChild(id), {
			enabled: !!id,
		});
	const {
		mutateAsync: createChild,
		isLoading: loadingCreateChild,
		isError: errorCreateChild,
	} = useMutation(routes.createChild, {
		onSuccess: () => {
			queryClient.invalidateQueries('getChildren');
		},
	});

	const { mutateAsync: updateChild } = useMutation(routes.updateChild, {
		onSuccess: async (data, variables) => {
			await queryClient.invalidateQueries(['getChildren'], data);
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

	const { mutateAsync: updateChildStatus, isLoading: loadingUpdateStatusChild } = useMutation(
		routes.updateChildStatus,
		{
			onSuccess: async (data) => {
				await queryClient.invalidateQueries(['getChildren'], data);
			}
		}
	);


	const getChildrenList = () =>
		useQuery(['getChildren'], () => routes.getChildren());


	return {
		children,
		activeChildren,
		getChildById,
		createChild,
		updateChild,
		hasChildren,
		loading,
		error,
		child,
		getChildrenList,
		updateChildStatus,
	};
};
export default useChildren;
