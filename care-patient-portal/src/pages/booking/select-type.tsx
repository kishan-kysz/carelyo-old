import { Grid, SimpleGrid, Space } from '@mantine/core';
import meet_doctor_online from '../../assets/images/menu/meet_doctor_online.svg';
import meet_doctor_physically from '../../assets/images/menu/meet_doctor_physically.svg';
import Styles from '../../assets/styles/pages/home.module.css';
import NavCard from '../../components/core/nav-card';
import Container from '../../components/layout/container';
import { useBooking } from '../../hooks/use-booking';
import { t } from 'i18next';

const ConsultationType = ({
	nextStep,
	showNext = true,
}: {
	nextStep: () => void;
	previousStep: () => void;
	showNext: boolean;
}) => {
	const { actions } = useBooking();

	const handleNext = (type: 'VIRTUAL' | 'PHYSICAL') => {
		actions.handleAddType(type);
		nextStep();
	};

	return (
		<>
			{showNext ? (
				<Container>
					<Space h="md" />
					<Grid className={Styles['flex-container-one']}>
						<SimpleGrid
							cols={2}
							spacing="xl"
							breakpoints={[{ maxWidth: 625, cols: 1, spacing: 'md' }]}
						>
							<NavCard
								image={meet_doctor_online}
								title={t('tr.virtual')}
								onClick={() => handleNext('VIRTUAL')}
							/>
							<NavCard
								image={meet_doctor_physically}
								title={t('tr.in-person')}
								onClick={() => handleNext('PHYSICAL')}
							/>
						</SimpleGrid>
					</Grid>
					<Space h="xl" />
				</Container>
			) : null}
		</>
	);
};
export default ConsultationType;
