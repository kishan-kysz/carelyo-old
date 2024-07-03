import { Grid, SimpleGrid, Space } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import followup from '../../assets/images/menu/consultation_followup.svg';
import Styles from '../../assets/styles/pages/home.module.css';
import PageTitle from '../../components/core/page-title';
import NavCard from '../../components/core/nav-card';
import Container from '../../components/layout/container';
import prescription from '../../assets/images/menu/consultation_prescription.svg';
import invitation from '../../assets/images/menu/invite_friend_and_family.svg';
import { AvailableRoutes } from '../navigation';

interface IServices {
	title: string;
	path: AvailableRoutes;
	image: string;
}

const services: IServices[] = [
	{
		title: 'tr.consultation-history',
		path: 'consultations',
		image: followup,
	},
	{
		title: 'tr.drug-prescriptions',
		path: 'prescriptions',
		image: prescription,
	},
	{
		title: 'tr.follow-up',
		path: 'followup',
		image: followup,
	},
	{
		title: 'tr.invitation',
		path: 'invitations',
		image: invitation,
	},
];

export const Services = () => {
	const { t } = useTranslation(['default']);
	return (
		<Container>
			<PageTitle heading={`${t('tr.service').toUpperCase()}`} />
			<Space h="md" />
			<Grid className={Styles['flex-container-one']}>
				<SimpleGrid
					cols={2}
					spacing="xl"
					breakpoints={[
						{ maxWidth: 900, cols: 2, spacing: 'md' },
						{ maxWidth: 625, cols: 1, spacing: 'md' },
					]}
				>
					{services?.map((item) => (
						<NavCard
							key={item.path}
							title={t(item.title)}
							path={item.path}
							image={item.image}
						/>
					))}
				</SimpleGrid>
			</Grid>
		</Container>
	);
};
