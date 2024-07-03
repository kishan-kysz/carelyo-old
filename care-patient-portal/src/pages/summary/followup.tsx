import { Fragment } from 'react';
import PageTitle from '../../components/core/page-title';
import Container from '../../components/layout/container';
import { useTranslation } from 'react-i18next';
import FollowUpItem from '../../components/summary/followup-item';

export const FollowUp = () => {
	const { t } = useTranslation(['default']);
	return (
		<Fragment>
			<Container sx={{ flex: '1', justifyContent: 'flex-start' }}>
				<PageTitle heading={`${t('tr.follow-up')}`} />
				<FollowUpItem />
			</Container>
		</Fragment>
	);
};
