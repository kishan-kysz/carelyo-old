import { Container } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import Provider from '../../components/core/provider';
import PageTitle from '../../components/core/page-title';

export const HealthcareProvider = () => {
	const { t } = useTranslation(['default']);

	return (
		<Container>
			<PageTitle heading={`${t('tr.provider')}`} />
			<Provider />
		</Container>
	);
};
