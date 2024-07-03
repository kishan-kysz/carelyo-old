import {
	Box,
	Button,
	Container,
	createStyles,
	Group,
	Image,
	keyframes,
	Loader,
	Modal,
	Stack,
	Text,
	Title,
	Tooltip,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import doctor from '../../assets/images/doctor.svg';
import empty from '../../assets/images/empty.svg';
import useCountdown from '../../hooks/use-countdown';
import { useConsultation } from '../../hooks/use-consultation';
import { Fragment, useEffect } from 'react';
import useProfile from '../../hooks/use-profile';
import { useGuardedNavigation } from '../navigation';
import PageTitle from '../../components/core/page-title';
import { useDisclosure } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import { routes } from '../../api/routes';
import PhysicalConsultation from './physical';

export const WaitingRoom = () => {
	const { navigate } = useGuardedNavigation();
	const { classes } = useStyles();
	const { user } = useProfile();
	const activeConsultation = user?.activeConsultation
		? user?.activeConsultation
		: null;
	const hasActiveConsultation =
		activeConsultation !== null && !!activeConsultation.id;
	const { t } = useTranslation(['default']);
	const { cancelConsultation, loading } = useConsultation();
	const { minutes, seconds, handleReset } = useCountdown({
		id: activeConsultation?.id,
	});

	const [cancelModalOpened, { toggle: showCancel, close }] =
		useDisclosure(false);
	const { mutateAsync: retainConsultation, isLoading } = useMutation(
		['retainConsultation'],
		routes.retainConsultation,
		{
			onSuccess: () => {
				handleReset();
				close();
			},
		}
	);
	const isPhysicalConsultation = activeConsultation?.type === 'PHYSICAL';
	const handleCancel = async () => {
		await cancelConsultation(activeConsultation?.id);
		close();
		navigate('home');
	};
	const handleRetain = async () => {
		await retainConsultation(activeConsultation!.id);
	};

	// started by Doctor
	useEffect(() => {
		if (!hasActiveConsultation) {
			navigate('home');
		}
		if (activeConsultation?.status === 'started' && !isPhysicalConsultation) {
			navigate('call');
		}
	}, [activeConsultation?.status, hasActiveConsultation]);

	const AcceptedByDoctor = () => {
		return (
			<Fragment>
				<Text>{t('tr.waiting_msg')}</Text>
				<Text>{t('tr.dr_msg')}</Text>
			</Fragment>
		);
	};
	const NoDoctorsAvailable = () => {
		return (
			<Fragment>
				<Container sx={{ flex: '1', justifyContent: 'flex-start' }}>
					<PageTitle heading={`${t('tr.waiting-room')}`} />
				</Container>
				<Box className={classes.container}>
					<Image src={empty} width={240} className={classes.image} />
					<Text className={classes.infoMessage}>
						{t('tr.doctors_busy')}
						<Text size="sm" color="dark">
							{t('tr.once-available-a-doctor-will-accpet-your-booking')}
						</Text>
						<Loader variant="dots" />
					</Text>
					<Group position="center">
						<Button color="red" loading={loading} onClick={showCancel}>
							{t('tr.cancel')}
						</Button>
					</Group>
				</Box>
			</Fragment>
		);
	};

	const CountingDown = () => {
		return (
			<Box className={classes.container}>
				<Image src={doctor} width={80} className={classes.image} />
				<Text className={classes.infoMessage}>{t('tr.booking_confirmed')}</Text>
				{activeConsultation?.status === 'accepted' ? (
					<AcceptedByDoctor />
				) : (
					<Fragment>
						<Text className={classes.infoMessage}>
							{t('tr.booking_registered')}
						</Text>
						<Text>{t('tr.waiting_for_doctor')}</Text>
					</Fragment>
				)}

				<Text className={classes.deviceMessage}>{t('tr.device_msg')}</Text>
				<Loader className={classes.loader} variant="dots" />
				<Text className={classes.timeMessage}>
					{minutes < 10 ? `0${minutes}` : minutes}:
					{seconds < 10 ? `0${seconds}` : seconds}
				</Text>
				{minutes <= 9 && seconds <= 59 ? (
					<Group position="center">
						<Button
							className={classes.button}
							color="red"
							loading={loading}
							onClick={showCancel}
						>
							{t('tr.cancel')}
						</Button>
					</Group>
				) : undefined}
			</Box>
		);
	};
	const HandleRender = () => {
		if (activeConsultation && minutes <= 0 && seconds <= 0) {
			return <NoDoctorsAvailable />;
		} // counting down
		return <CountingDown />;
	};

	return (
		<Fragment>
			{isPhysicalConsultation ? (
				<PhysicalConsultation
					activeConsultation={activeConsultation}
					cancelConsultation={showCancel}
				/>
			) : (
				<HandleRender />
			)}
			<CancelModal
				retainLoading={isLoading}
				cancelLoading={loading}
				opened={cancelModalOpened}
				isRetain={false}
				onClose={close}
				onConfirm={handleCancel}
				onRetain={handleRetain}
			/>
		</Fragment>
	);
};

export default WaitingRoom;
const CancelModal = ({
	opened,
	isRetain,
	cancelLoading,
	retainLoading,
	onClose,
	onConfirm,
	onRetain,
}: {
	opened: boolean;
	isRetain: boolean;
	retainLoading: boolean;
	cancelLoading: boolean;
	onClose: () => void;
	onConfirm: () => void;
	onRetain: () => void;
}) => {
	const { t } = useTranslation(['default']);
	const { classes } = useStyles();
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			size="lg"
			centered={true}
			title="Cancel Consultation?"
		>
			<Title order={5}>{t('tr.are-you-sure-you-want-to-cancel')}</Title>
			<Stack>
				<Text color="red.7" size="sm">
					{t('tr.by-cancelling-your-consulation-you-will-lose-your-position-in-the-queue')}
				</Text>
				<Text color="teal.7" size="sm">
					{isRetain &&
						t('tr.you-can-keep-your-position-in-the-queue-and-wait-for-a-doctor-to-be-available')}
				</Text>
			</Stack>
			<Group position="center">
				<Tooltip label="You will lose your queue" color="red" position="bottom">
					<Button loading={cancelLoading} color="red.7" onClick={onConfirm}>
						{t('tr.i-am-sure')} {t('tr.cancel')}
					</Button>
				</Tooltip>
				{isRetain ? (
					<Button
						className={classes.button}
						loading={retainLoading}
						color="teal"
						onClick={onRetain}
					>
						{t('tr.retain')}
					</Button>
				) : (
					<Button onClick={onClose} color="teal">
						{' '}
						{t('tr.keep-my-position')}
					</Button>
				)}
			</Group>
		</Modal>
	);
};

const useStyles = createStyles(() => ({
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		width: '100%',
		'& *': {
			textAlign: 'center',
			fontFamily: 'Poppins, sans-serif',
		},
	},
	image: {
		marginTop: '4em',
		background: '#a5e0d5',
		boxShadow: '0 0 0 0 rgb(0 0 0 / 100%)',
		borderRadius: '50%',
		overflow: 'hidden',
		transform: 'scale(1)',
		animation: `${pulse} 2s infinite`,
	},
	infoMessage: {
		color: '#05a98b',
		fontWeight: 700,
		fontSize: '1.3em',
		padding: '1.5rem',
	},
	loader: {
		marginTop: '.5rem',
	},
	deviceMessage: {
		padding: '.8rem 0',
	},
	timeMessage: {
		color: '#333',
		fontWeight: 500,
		fontSize: '0.9em',
		paddingTop: '2rem',
	},
	button: {
		margin: 10,
		minWidth: 90,
	},
}));

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
