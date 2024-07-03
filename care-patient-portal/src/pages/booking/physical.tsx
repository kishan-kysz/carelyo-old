import {
	Box,
	Button,
	Center,
	createStyles,
	Flex,
	Group,
	Image,
	keyframes,
	Paper,
	rem,
	Text,
	Timeline,
} from '@mantine/core';
import doctor from '../../assets/images/doctor.svg';
import {
	IconCheck,
	IconChecklist,
	IconLock,
	IconLockOpen,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

function PhysicalConsultation({
	activeConsultation,
	cancelConsultation,
}: {
	activeConsultation: any;
	cancelConsultation: () => void;
}) {
	const { classes } = useStyles();
	const { t } = useTranslation(['default']);
	const mapStatusToIndex: Record<string, number> = {
		booked: 0,
		accepted: 1,
		started: 2,
	};

	return (
		<>
			<Flex
				mih={700}
				gap="md"
				justify="center"
				align="center"
				direction="row"
				wrap="wrap"
			>
				<Paper
					radius="lg"
					withBorder={true}
					className={classes.card}
					mt={`calc(${ICON_SIZE} / 3)`}
					mx={25}
					px={20}
					py={50}
					shadow="sm"
					w={500}
				>
					<Image
						className={classes.image}
						src={doctor}
						width={100}
						radius={50}
					/>
					<Text
						ta="center"
						fz={25}
						fw={700}
						mb={40}
						mt={30}
						className={classes.title}
					>
						{t('tr.physical-booking-details')}
					</Text>

					<Box mx={30}>
						<Center mx="auto">
							<Timeline active={mapStatusToIndex[activeConsultation?.status]}>
								<Timeline.Item
									title="Registered"
									bulletSize={30}
									bullet={<IconChecklist size="1.2rem" />}
									color="teal.7"
								>
									<Text color="dimmed" size="sm">
										{t('tr.waiting-for-doctor')}
									</Text>
								</Timeline.Item>
								<Timeline.Item
									title="Booking Confirmed"
									bulletSize={30}
									bullet={<IconCheck size="1.2rem" />}
								>
									<Text color="dimmed" size="sm">
										{t('tr.doctor-is-getting-ready')}
									</Text>
								</Timeline.Item>
								<Timeline.Item
									title="Consultation Started"
									bulletSize={30}
									bullet={<IconLockOpen size="1.2rem" />}
								>
									<Text color="dimmed" size="sm">
										{t('tr.your-consulation-has-started')}
									</Text>
								</Timeline.Item>
								<Timeline.Item
									title="Consultation Feedback"
									bulletSize={30}
									bullet={<IconLock size="1.2rem" />}
								>
									<Text color="dimmed" size="sm">
										{t('tr.your-consulation-has-ended')}
										<Text>{t('tr.please-leave-feedback')}</Text>
									</Text>
								</Timeline.Item>
							</Timeline>
						</Center>
					</Box>
					<Group position="center" mt={40}>
						{activeConsultation?.status === 'booked' && (
							<Button color="red.4" onClick={cancelConsultation}>
								{t('tr.cancel-booking')}
							</Button>
						)}
					</Group>
				</Paper>
			</Flex>
		</>
	);
}

export default PhysicalConsultation;

const pulse = keyframes({
	'0%': {
		transform: 'scale(0.75)',
		boxShadow: '0 0 0 0 rgb(164 255 240 / 70%)',
	},
	'70%': {
		transform: 'scale(0.8)',
		boxShadow: '0 0 0 10px rgb(120 209 194 / 70%)',
	},
	'100%': {
		transform: 'scale(0.75)',
		boxShadow: '0 0 0 0 rgb(63 165 148 / 70%)',
	},
});
const ICON_SIZE = rem(50);
const useStyles = createStyles((theme) => ({
	card: {
		position: 'relative',
		overflow: 'visible',
		padding: theme.spacing.xl,
		paddingTop: `calc(${theme.spacing.xl} * 1.5 + ${ICON_SIZE} / 3)`,
	},

	title: {
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		lineHeight: 1,
	},
	image: {
		background: '#a5e0d5',
		boxShadow: '0 0 0 0 rgb(0 0 0 / 100%)',
		borderRadius: '50%',
		overflow: 'hidden',
		transform: 'scale(1)',
		animation: `${pulse} 2s infinite`,
		position: 'absolute',
		top: `calc(-${rem(50)} / 1)`,
		left: `calc(50% - ${ICON_SIZE} / 1)`,
	},
}));
