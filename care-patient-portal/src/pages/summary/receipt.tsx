import PageTitle from '../../components/core/page-title';
import Container from '../../components/layout/container';
import { useTranslation } from 'react-i18next';
import ReceiptItem from '../../components/summary/receipt-item';
import { useParams } from 'react-router-dom';
import { formatUrlParamsToNumber } from '../../utils';

export const Receipt = () => {
	const { t } = useTranslation(['default']);
	const { consultationId } = useParams();
	return (
		<Container>
			<PageTitle heading={`${t('tr.receipt').toUpperCase()}`} />
			<ReceiptItem id={formatUrlParamsToNumber(consultationId)} />
		</Container>
	);
};
