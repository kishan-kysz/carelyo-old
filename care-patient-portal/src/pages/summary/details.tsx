import Container from '../../components/layout/container';
import { Fragment } from 'react';
import SummaryItem from '../../components/summary/summary-item';
import PageTitle from '../../components/core/page-title';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatUrlParamsToNumber } from '../../utils';

export const ConsultationInfo = () => {
	const { consultationId } = useParams();
	const { t } = useTranslation(['default']);
	return (
		<Fragment>
			<Container sx={{ flex: '1', justifyContent: 'flex-start' }}>
				<PageTitle heading={`${t('tr.consultation-info')}`} />
				<SummaryItem id={formatUrlParamsToNumber(consultationId)} />
			</Container>
		</Fragment>
	);
};
