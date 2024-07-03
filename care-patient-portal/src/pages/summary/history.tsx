import { Fragment } from 'react';

import PageTitle from '../../components/core/page-title';
import Container from '../../components/layout/container';
import { useTranslation } from 'react-i18next';
import SummaryList from '../../components/summary/summary-list';

export const ConsultationHistory = () => {
	const { t } = useTranslation(['default']);
	return (
		<Fragment>
			<Container sx={{ flex: '1', justifyContent: 'flex-start' }}>
				<PageTitle heading={`${t('tr.consultation-history')}`} />
				<SummaryList />
			</Container>
		</Fragment>
	);
};
