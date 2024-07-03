import { Grid, SimpleGrid } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import doctor from '../assets/images/menu/consultation_doctor.svg';
import service from '../assets/images/menu/service.svg';
import provider from '../assets/images/menu/provider_doctor.svg';
import inbox from '../assets/images/menu/inbox.svg';
import Styles from '../assets/styles/pages/home.module.css';
import WelcomeBox from '../components/core/welcome-box';
import NavCard from '../components/core/nav-card';
import { useConsultation } from '../hooks/use-consultation';
import Container from '../components/layout/container';

export const Home = () => {
	const { consultation } = useConsultation();
	const { t } = useTranslation(['default']);

	return (
		<Container>
			<WelcomeBox />
			<Grid className={Styles['flex-container-one']}>
				<SimpleGrid
					cols={2}
					spacing="xl"
					breakpoints={[{ maxWidth: 625, cols: 1, spacing: 'md' }]}
				>
					<NavCard
						image={doctor}
						title={`${t('tr.see-a-doctor')}`}
						path={consultation?.status ? 'waitingroom' : 'booking'}
					/>
					<NavCard
						image={inbox}
						title={t('tr.inbox').toUpperCase()}
						path="messages"
					/>
					<NavCard
						image={provider}
						title={`${t('tr.provider')}`}
						path="provider"
					/>
					<NavCard
						image={service}
						title={`${t('tr.service')}`}
						path="services"
					/>
				</SimpleGrid>
			</Grid>
		</Container>
	);
};
