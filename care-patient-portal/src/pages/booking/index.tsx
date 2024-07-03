import { Fragment, useState } from 'react';
import PageTitle from '../../components/core/page-title';
import Container from '../../components/layout/container';
import { useTranslation } from 'react-i18next';
import { Stepper } from '@mantine/core';
import { ChildConsultation } from './for-child';
import { useBooking } from '../../hooks/use-booking';
import ConsultationNav from '../../components/booking/select-for';
import ConsultationType from './select-type';
import BodyArea from '../../components/booking/body-area';
import BookingDetails from '../../components/booking/booking-details';
import BookingSummary from '../../components/booking/booking-summary';

export type StepperProps = { previousStep: () => void; nextStep: () => void };

export const Booking = () => {
	const { t } = useTranslation(['default']);
	const { booking } = useBooking();
	const steps = [
		{ 
			label: 'Step1', 
			component: ConsultationNav },
		{
			label: 'Step2',
			component: booking.bookingFor === 'patient' ? ConsultationType : ChildConsultation,
		},
		{ 
			label: 'Step3', 
			component: BodyArea
		},
		{ 
			label: 'Step4', 
			component: BookingDetails
		},
		{ 
			label: 'Step5', 
			component: BookingSummary,
		},
	];

	const [active, setActive] = useState(0);
	const nextStep = () =>
		setActive((current) => (current < 5 ? current + 1 : current));
	const prevStep = () =>
		setActive((current) => (current > 0 ? current - 1 : current));

	return (
		<Fragment>
			<Container sx={{ flex: '1', justifyContent: 'flex-start' }}>
				<PageTitle
					heading={
						active === 4
							? `${t('tr.booking-summary').toUpperCase()}`
							: `${t('tr.book-appointment').toUpperCase()}`
					}
				/>
			</Container>
			<Container>
				<Stepper
					styles={{
						separator: {
							display: 'none',
						},
					}}
					active={active}
					onStepClick={setActive}
					breakpoint="sm"
					w="100%"
				>
					{steps.map((step) => (
						<Stepper.Step key={step.label} withIcon={false} step={active}>
							<step.component nextStep={nextStep} previousStep={prevStep} />
						</Stepper.Step>
					))}
				</Stepper>
			</Container>
		</Fragment>
	);
};
