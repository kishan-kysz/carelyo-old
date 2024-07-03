import {
	Button,
	Card,
	Container,
	Divider,
	Flex,
	Group,
	Image,
	Paper,
	SimpleGrid,
	Stack,
	Table,
	Text,
	Title,
	useMantineTheme
} from '@mantine/core';
import { Fragment, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@mantine/hooks';
import useProvider from '../../hooks/use-provider';
import AudioPlayer from './audio/audio-player';
import { useBooking } from '../../hooks/use-booking';
import { convertBaseToString} from '../../utils';
import { useGuardedNavigation } from '../../pages/navigation';
import Cookies from 'js-cookie';
import useProfile from '../../hooks/use-profile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { routes } from '../../api/routes';
import {
	ICreateConsultationResponse,
	IPaymentInfo,
	IPaystackPayment,
	IStripePayment
} from '../../api/types';
import PaymentSelect from '../payment/select/payment-select';
import styles from '../payment/select/payment-option.module.css';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
import { IconCaretLeft} from '@tabler/icons-react';
import { useStateMachine } from 'little-state-machine';
import useChildren from '../../hooks/use-children';
import { setChildId } from '../../consultation-state';


type SummaryProps = {
	previousStep: () => void;
};

const currentDate = new Date().toJSON().slice(0, 10);

const TextWithDescription = ({
	title,
	description,
}: {
	title: string;
	description?: ReactNode;
}) => {
	return (
		<Stack spacing={0} align="start" w="inherit">
			<Text size="lg" weight={500} color="dimmed">
				{title}
			</Text>
			{typeof description === 'string' ? (
				<Text align="start">{description}</Text>
			) : (
				description
			)}
		</Stack>
	);
};
const persistPaymentStateToCookies = ({
	id,
	url,
}: {
	id: string;
	url: string;
}) => {
	Cookies.set(id, url, { expires: 24 });
};

const persistPaymentInfoToCookies = ({
	paymentInfo,
}: {
	paymentInfo: IPaymentInfo;
}) => {
	Cookies.set('tr_info', JSON.stringify(paymentInfo), { expires: 1 });
};

const BookingSummary = ({ previousStep }: SummaryProps) => {
	const { breakpoints } = useMantineTheme();
	const queryClient = useQueryClient();
	const isSmall = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);
	const { t } = useTranslation(['default']);
	const { booking, actions } = useBooking();
	const { provider } = useProvider();
	const { user } = useProfile();
	const router = useGuardedNavigation();
	const {
		state: { consultation },
	} = useStateMachine({ setChildId });
	const { child } = useChildren(consultation.childId);

	const { mutateAsync: createConsultation, isLoading } = useMutation(
		routes.createConsultation,
		{
			onSuccess: () => {
				void queryClient.invalidateQueries(['getProfile']);
			},
			onError: () => {
				showNotification({
					title: t('tr.error'),
					message: t('tr.error-occured-booking'),
					color: 'red',
				});
			},
		}
	);

	const handlePayment = async () => {
		try {
			let byteArray: Uint8Array = new Uint8Array(0);

			if (booking.audioDetailedDescription) {
				byteArray = convertBaseToString(booking.audioDetailedDescription);
			}
			await fetch('http://localhost:4242/create-payment-intent', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ items: [{ id: 'xl-tshirt' }] }),
			})
				.then((res) => res.json())
				.then((data) => {
					//Fake backend response
					const createConsultationResponse: ICreateConsultationResponse = {
						id: 1,
						status: '',
						timeBooked: '',
						clientSecret: data.clientSecret,
						referenceId: 'fsdgsdfgsdfg',
						transactionUrl: '',
						paymentProvider: 'stripe',
						duration: 1,
					};

					//like before
					const paymentInfo = CreatePaymentInfo(createConsultationResponse);

					//Set paymentInfo object to cookies for verify payment to use when navigated
					persistPaymentInfoToCookies({
						paymentInfo,
					});

					//Navigate to payment page
					router.navigate('tr');
				});

			/* 	await createConsultation({
				bodyArea: booking.bodyArea,
				consultationType: booking.consultationType,
				textDetailedDescription: booking.textDetailedDescription,
				images: booking.images,
				audioDetailedDescription: [...byteArray],
				amountPaid: booking.amountPaid,
				priceListName: booking.priceListName
			},
			{
				onSuccess: (data) => {
					notifications.show({
						title: 'Booking Successful',
						message: 'Continue to payment',
						color: 'green',
					});
					actions.reset();
					
					const paymentInfo = CreatePaymentInfo(data);

					//Set paymentInfo object to cookies for verify payment to use when navigated
					persistPaymentInfoToCookies({
						paymentInfo
					});
					
					//Navigate to payment page
					router.navigate('tr');
				},
				onSettled: () => {
					//setIsHandlingPayment(false);
				}
			}); */
		} catch (error) {
			console.log(error);
		}
	};

	const calculateBalance = (wallet: number, cost: number) => {
		if (!wallet) {
			return cost;
		}
		const calculation = Math.abs(wallet - cost);
		if (calculation > cost) {
			return 0;
		} else {
			return calculation;
		}
	};

	const handleDeleteRecording = () => {
		previousStep();
		actions.handleAddAudioRecording('');
		showNotification({
			message: `${t('tr.recording-deleted')}`,
			color: 'red',
			autoClose: 2500,
		});
	};

	return (
		<Container>
			<Flex className={styles.flexWrapper} direction="row">
				<Paper
					// className={styles.noBottomRadius}
					radius="md"
					p="sm"
					color="blue"
					pb="sm"
					shadow="md"
				>
					<Card.Section>
						<Group position="apart" noWrap={true}>
							<Stack spacing="xs" pt="xl" pl="xl" align="start">
								<Title
									color={mantineConfig.mantine.title.color}
									size={mantineConfig.mantine.title.heading.subheading.fontSize}
									weight={mantineConfig.mantine.title.fontWeight}
								>
									{t('tr.healthcare-provider').toUpperCase()}
								</Title>
								<Text
									style={{
										fontFamily: mantineConfig.mantine.global.fontFamily,
									}}
									color={mantineConfig.mantine.text.color}
									size={mantineConfig.mantine.text.label.title.fontSize}
									weight={mantineConfig.mantine.title.fontWeight}
								>
									{provider?.providerName}
								</Text>
							</Stack>
							<Text
								pr="xl"
								style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
								color={mantineConfig.mantine.text.color}
								size={
									mantineConfig.mantine.text.fontSize
								} /* weight={mantineConfig.mantine.text.fontWeight} */
							>
								{currentDate}
							</Text>
						</Group>
					</Card.Section>
					<Card.Section mt="md" pl="xl" pr="xl">
						<Group position="center">
							<Paper
								w={{ xs: '100%', sm: '60%', md: 650 }}
								withBorder={true}
								radius={{ xs: 'sm', sm: 'md', md: 'lg' }}
								shadow="sm"
							>
								<Table
									withColumnBorders={true}
									style={mantineConfig?.mantine?.table?.container}
								>
									<tbody>
										<tr>
											<th style={mantineConfig?.mantine?.table?.header?.th}>
												{t('tr.your-account-balance').toUpperCase()}
											</th>
											<td
												style={mantineConfig?.mantine?.table?.body?.td}
												className="table-data"
											>
												<Text className="responsive-table-text" weight="bold">
													{user?.wallet ? user?.wallet.balance : 0}{' '}
													{provider?.currency}
												</Text>
											</td>
										</tr>
										<tr>
											<th style={mantineConfig?.mantine?.table?.header?.th}>
												{t('tr.booking-cost').toUpperCase()}
											</th>
											<td
												style={mantineConfig?.mantine?.table?.body?.td}
												className="table-data"
											>
												<Text className="responsive-table-text" weight="bold">
													{booking?.amountPaid} {provider?.currency}
												</Text>
											</td>
										</tr>
										<tr>
											<th style={mantineConfig?.mantine?.table?.header?.th}>
												{t('tr.amount-to-pay').toUpperCase()}
											</th>
											<td
												style={mantineConfig?.mantine?.table?.body?.td}
												className="table-data"
											>
												<Text
													className="responsive-table-text text-bold"
													weight="bold"
												>
													{calculateBalance(
														user?.wallet ? user?.wallet.balance : 0,
														booking?.amountPaid
													)}{' '}
													{provider?.currency}
												</Text>
											</td>
										</tr>
										<tr>
											<th style={mantineConfig?.mantine?.table?.header?.th}>
												{t('tr.duration').toUpperCase()}
											</th>
											<td
												style={mantineConfig?.mantine?.table?.body?.td}
												className="table-data"
											>
												<Text className="responsive-table-text" weight="bold">
													{booking?.duration} {t('tr.minutes')}
												</Text>
											</td>
										</tr>
									</tbody>
								</Table>
							</Paper>
						</Group>
					</Card.Section>

					<Divider my="md" />
					<Stack
						spacing="sm"
						pl="xl"
						pr="xl"
						align="start"
						sx={{ width: '100%' }}
					>
						{booking?.bookingFor === 'patient' ?
							<Fragment>
								<Title
									color={mantineConfig.mantine.title.color}
									size={mantineConfig.mantine.title.fontSize}
									weight={mantineConfig.mantine.title.fontWeight}
								>
									{t('tr.name')}
								</Title>
								<Text
									style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
									color={mantineConfig.mantine.text.color}
									size={mantineConfig.mantine.text.fontSize}
									weight={mantineConfig.mantine.text.fontWeight}
								>
									{' '}
									{`${user?.firstName} ${user?.surName}`}
								</Text>
							</Fragment> :
							<Fragment>
								<Title
									color={mantineConfig.mantine.title.color}
									size={mantineConfig.mantine.title.fontSize}
									weight={mantineConfig.mantine.title.fontWeight}
								>
									{(t('tr.Child-parent'))}
								</Title>
								<Text
									style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
									color={mantineConfig.mantine.text.color}
									size={mantineConfig.mantine.text.fontSize}
									weight={mantineConfig.mantine.text.fontWeight}
								>
									{' '}
									{`${user?.firstName} ${user?.surName}`}
								</Text>
								<Title
									color={mantineConfig.mantine.title.color}
									size={mantineConfig.mantine.title.fontSize}
									weight={mantineConfig.mantine.title.fontWeight}
								>
									{t('tr.child-name')}
								</Title>
								<Text
									style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
									color={mantineConfig.mantine.text.color}
									size={mantineConfig.mantine.text.fontSize}
									weight={mantineConfig.mantine.text.fontWeight}
								>
									{' '}
									{`${child?.name}`}
								</Text>
							</Fragment>
						}

						<Title
							color={mantineConfig.mantine.title.color}
							size={mantineConfig.mantine.title.fontSize}
							weight={mantineConfig.mantine.title.fontWeight}
						>{`${t('tr.appointment-regarding')}`}</Title>
						<Text
							style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
							color={mantineConfig.mantine.text.color}
							size={mantineConfig.mantine.text.fontSize}
							weight={mantineConfig.mantine.text.fontWeight}
						>
							{' '}
							{`${booking?.bodyArea.join(', ')}`}
						</Text>

						<Title
							color={mantineConfig.mantine.title.color}
							size={mantineConfig.mantine.title.fontSize}
							weight={mantineConfig.mantine.title.fontWeight}
						>{`${t('tr.appointment-note')}`}</Title>
						<Text
							style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
							color={mantineConfig.mantine.text.color}
							size={mantineConfig.mantine.text.fontSize}
							weight={mantineConfig.mantine.text.fontWeight}
						>
							{booking.textDetailedDescription
								? booking.textDetailedDescription
								: `${t('tr.no-notes-provided')}`}
						</Text>

						<Title
							color={mantineConfig.mantine.title.color}
							size={mantineConfig.mantine.title.fontSize}
							weight={mantineConfig.mantine.title.fontWeight}
						>{`${t('tr.appointment-record')}`}</Title>
						<Text
							style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
							color={mantineConfig.mantine.text.color}
							size={mantineConfig.mantine.text.fontSize}
							weight={mantineConfig.mantine.text.fontWeight}
						>
							{booking?.audioDetailedDescription?.length > 1 ? (
								<AudioPlayer
									base64Data={booking?.audioDetailedDescription}
									onDeleteRecording={handleDeleteRecording}
								/>
							) : (
								`${t('tr.not-recorded')}`
							)}
						</Text>

						<Flex justify="flex-start" direction="column" wrap="wrap">
							<Title
								mb="xs"
								color={mantineConfig.mantine.title.color}
								size={mantineConfig.mantine.title.fontSize}
								weight={mantineConfig.mantine.title.fontWeight}
							>{`${t('tr.appointment-images')}`}</Title>

							{booking?.images?.length > 0 ? (
								<SimpleGrid cols={5}>
									{booking?.images?.map((file, index) => (
										<div key={index}>
											<Image
												src={`data:image/png;base64,${file.encodedContent}`}
												alt={`Image ${index + 1}`}
												style={{ cursor: 'pointer' }}
												height="100%"
											/>
										</div>
									))}
								</SimpleGrid>
							) : (
								<Text
									style={{
										fontFamily: mantineConfig.mantine.global.fontFamily,
									}}
									color={mantineConfig.mantine.text.color}
									size={mantineConfig.mantine.text.fontSize}
									weight={mantineConfig.mantine.text.fontWeight}
									align="start"
								>{`${t('tr.no-images-added')}`}</Text>
							)}
						</Flex>
						<Title
							color={mantineConfig.mantine.title.color}
							size={mantineConfig.mantine.title.fontSize}
							weight={mantineConfig.mantine.title.fontWeight}
						>{`${t('tr.consent')}`}</Title>
						<Text
							style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
							color={mantineConfig.mantine.text.color}
							size={mantineConfig.mantine.text.fontSize}
							weight={mantineConfig.mantine.text.fontWeight}
						>{`${t('tr.carelyo-medical-journal')}`}</Text>
					</Stack>

					<Divider my="md" className={styles.goHide} />

					<Group className={styles.goHide} position="apart" mt="xs" p="md">
						<Button
							onClick={previousStep}
							leftIcon={
								<IconCaretLeft size={mantineConfig.mantine.button.iconSize} />
							}
							color={mantineConfig.mantine.button.back.backgroundColor}
							style={{
								color: mantineConfig.mantine.button.fontColor,
							}}
						>
							{`${t('tr.back').toUpperCase()}`}
						</Button>
					</Group>
				</Paper>
				<PaymentSelect previousStep={previousStep} />
			</Flex>
		</Container>
	);
};

const CreatePaymentInfo = (data: ICreateConsultationResponse) => {
	//Create paymentInfo object
	const paymentInfo: IPaymentInfo = {
		paymentProvider: data.paymentProvider,
		referenceId: data.referenceId,
		data: null,
	};

	//Create objects depending on paymentProvider and set to paymentInfo
	switch (paymentInfo.paymentProvider) {
		case 'paystack': {
			const paystack: IPaystackPayment = {
				transactionUrl: data.transactionUrl,
			};

			paymentInfo.data = paystack;
			break;
		}
		case 'stripe': {
			const stripe: IStripePayment = {
				clientSecret: data.clientSecret,
			};

			paymentInfo.data = stripe;
			break;
		}
		case 'wallet':
			break;
		default:
			console.log('error: ' + paymentInfo.paymentProvider);
			break;
	}

	return paymentInfo;
};

export default BookingSummary;
