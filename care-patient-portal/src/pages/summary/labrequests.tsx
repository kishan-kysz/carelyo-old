import { useParams } from 'react-router-dom';

import PageTitle from '../../components/core/page-title';
import Container from '../../components/layout/container';
import { useTranslation } from 'react-i18next';
import LabItem from '../../components/summary/lab-item';
import { formatUrlParamsToNumber } from '../../utils';

export const LabRequests = () => {
	const { consultationId } = useParams();
	const { t } = useTranslation(['default']);
	return (
		<Container>
			<PageTitle heading={`${t('tr.laboratory-test')}`} />
			<LabItem id={formatUrlParamsToNumber(consultationId)} />
		</Container>
	);
};
