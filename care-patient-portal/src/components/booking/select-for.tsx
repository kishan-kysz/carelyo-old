import {
	Box,
	Grid,
	SimpleGrid,
	Space,
	Text,
	Anchor
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import consultation from '../../assets/images/menu/consultation.svg';
import child_image from '../../assets/images/menu/consultation_child.svg';
import Styles from '../../assets/styles/pages/home.module.css';
import NavCard from '../core/nav-card';
import Container from '../layout/container';
import { useBooking } from '../../hooks/use-booking';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
import useConsultationPrice from '../../hooks/use-consultation-price';

const ConsultationNav = ({ nextStep }: { nextStep: () => void }) => {
	const { actions } = useBooking();
	const patientPriceList = useConsultationPrice('consultation');
	const childPriceList = useConsultationPrice('child');

	const handleNext = async (bookingFor: 'patient' | 'child') => {
		const response = bookingFor === 'patient' ? patientPriceList : childPriceList;
		actions.handleAddFor(bookingFor);
		actions.handleAmountPaid(response.priceList.price,  bookingFor == 'patient' ? 'consultation' : 'child');
		actions.handleAddDuration(response.priceList.duration);
		nextStep();
	};
	const { t } = useTranslation(['default']);

	return (
		<Container>
			<Space h="md" />
			<Grid className={Styles['flex-container-one']}>
				<SimpleGrid
					cols={2}
					spacing="xl"
					breakpoints={[{ maxWidth: 625, cols: 1, spacing: 'md' }]}
				>
					<NavCard
						image={consultation}
						title={t('tr.book-for-me')}
						onClick={() => handleNext('patient')}
						
					/>
					<Box>
						<NavCard
							image={child_image}
							title={t('tr.book-for-child')}
							onClick={() => handleNext('child')}
						/>
					</Box>
				</SimpleGrid>
			</Grid>
			<Space h="xl" />
			<Text
				color="{mantineConfig.mantine.text.color}"
				weight={mantineConfig.mantine.text.href.fontWeight}
				style={{
					fontFamily: mantineConfig.mantine.global.fontFamily,
					fontSize: mantineConfig.mantine.text.href.fontSize,
				}}
			>
				{' '}
				<Anchor
					color={mantineConfig.mantine.text.href.color}
					style={{
						fontFamily: mantineConfig.mantine.global.fontFamily,
						fontSize: mantineConfig.mantine.text.href.fontSize,
					}}
					weight={mantineConfig.mantine.text.href.fontWeight}
					href="/profile"
				>
					{t('tr.pathdesc')}{' '}
				</Anchor>
				{t('tr.infoText')}
			</Text>
		</Container>
	);
};
export default ConsultationNav;
