import { Grid, SimpleGrid, Space } from '@mantine/core';
import history from '../../assets/images/menu/consultation_history.svg';
import prescription from '../../assets/images/menu/consultation_prescription.svg';
import Styles from '../../assets/styles/pages/home.module.css';
import PageTitle from '../../components/core/page-title';
import NavCard from '../../components/core/nav-card';
import Container from '../../components/layout/container';
import { useTranslation } from 'react-i18next';

export const MedicalHistory = () => {
	const { t } = useTranslation(['default']);
	return (
		<Container>
			<PageTitle heading={`${t('tr.patient-history')}`} />
			<Space h="md" />
			<Grid className={Styles['flex-container-one']}>
				<SimpleGrid
					cols={2}
					spacing="xl"
					breakpoints={[{ maxWidth: 625, cols: 1, spacing: 'md' }]}
				>
					<NavCard
						title={t('tr.summary-history')}
						path="consultations"
						image={history}
					/>
					<NavCard
						title={t('tr.drug-prescriptions')}
						path="prescriptions"
						image={prescription}
					/>
				</SimpleGrid>
			</Grid>
		</Container>
	);
};
