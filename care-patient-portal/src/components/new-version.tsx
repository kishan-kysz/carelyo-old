import { useEffect, useState } from 'react';
import { useLocalStorage, usePrevious } from '@mantine/hooks';
import { Alert } from '@mantine/core';
import { env } from '../utils/env';
import { useTranslation } from 'react-i18next';

const useBuildId = () => {
	const [buildId, setBuildId] = useLocalStorage({
		key: 'buildId',
		defaultValue: env.VITE_BUILD_ID,
	});
	useEffect(() => {
		if (buildId !== env.VITE_BUILD_ID) {
			setBuildId(env.VITE_BUILD_ID);
		}
	}, [buildId]);
	return {
		buildId,
	};
};

export const NewVersion = () => {
	const [newVersionAvailable, setNewVersionAvailable] = useState(false);
	const { buildId } = useBuildId();
	const { t } = useTranslation(['default']);
	const prevBuildId = usePrevious(buildId);
	useEffect(() => {
		if (prevBuildId && buildId && prevBuildId !== buildId) {
			setNewVersionAvailable(true);
		}
		return () => {
			setNewVersionAvailable(false);
		};
	}, [buildId, prevBuildId]);
	if (newVersionAvailable) {
		return (
			<Alert color="red" title="A new version is available">
				{t('tr.please-reload-the-page-to-update-to-the-latest-version')}
			</Alert>
		);
	}
};
