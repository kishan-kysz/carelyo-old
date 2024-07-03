import {
	Button,
	Flex,
	Paper,
	Stack,
	Text
} from '@mantine/core';
import { useState, useEffect } from 'react';
import config from './config.json'; //Should come from server
import PaymentSelectOption from './payment-select-option';
import { useTranslation } from 'react-i18next';
import { useBooking } from '../../../hooks/use-booking';
import { convertBaseToString } from '../../../utils';
import {
	showNotification,
	NotificationType
} from '../../../utils/notification';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { routes } from '../../../api/routes';
import { useGuardedNavigation } from '../../../pages/navigation';
import {
	ICreateConsultationResponse,
	IPaymentInfo,
	IPaystackPayment,
	IStripePayment
} from '../../../api/types';
import Cookies from 'js-cookie';
import styles from './payment-option.module.css';
import mantineConfig from '../../../assets/styles/config/mantine.config.json';
import { IconCaretLeft} from '@tabler/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faFileShield } from '@fortawesome/free-solid-svg-icons';
import { useStateMachine } from 'little-state-machine';
import { setChildId} from '../../../consultation-state';
/*
    Only logic implemented, styling to be done later.
*/

const PaymentSelect = ({ previousStep }) => {
	const router = useGuardedNavigation();
	const queryClient = useQueryClient();
	const { booking, actions } = useBooking();
	const { t } = useTranslation(['default']);
	const [paymentOptions, setPaymentOptions] = useState<string[]>();
	const [paymentProvider, setPaymentProvider] = useState<string>();
	const {
		state: { consultation },
	} = useStateMachine({ setChildId });

	const { mutateAsync: createConsultation, isLoading } = useMutation(
		routes.createConsultation,
		{
			onSuccess: () => {
				void queryClient.invalidateQueries(['getProfile']);
			},
			onError: () => {
				showNotification(NotificationType.BookingError, t);
			},
		}
	);

	//Simulate api call, x ms delay
	useEffect(() => {
		const fetchData = async () => {
			await new Promise((r) => setTimeout(r, 1000));
			setPaymentOptions(['Paystack', 'Paypal', 'Stripe', 'Wallet']);

			// Set the default payment provider here
			setPaymentProvider('Paystack'); // Assuming 'Paystack' is the default payment provider
		};

		fetchData();
	}, []);

	const handlePayment = async () => {
		try {
			let byteArray: Uint8Array = new Uint8Array(0);

			if (booking.audioDetailedDescription) {
				byteArray = convertBaseToString(booking.audioDetailedDescription);
			}
			await createConsultation(
				{
					bodyArea: booking.bodyArea,
					consultationType: booking.consultationType,
					textDetailedDescription: booking.textDetailedDescription,
					images: booking.images,
					audioDetailedDescription: [...byteArray],
					amountPaid: booking.amountPaid,
					priceListName: booking.priceListName,
					paymentProvider: (paymentProvider as string).toLowerCase(),
					childId:  booking.bookingFor === 'child' ? consultation.childId  : -1
				},
				{
					onSuccess: (data) => {
						showNotification(NotificationType.BookingSuccess, t);

						actions.reset();

						const paymentInfo = CreatePaymentInfo(data);

						//Set paymentInfo object to cookies for verify payment to use when navigated
						persistPaymentInfoToCookies({
							paymentInfo,
						});

						//Navigate to payment page
						router.navigate('payment');
					},
				}
			); // Set a timeout for 30 seconds
			const timeoutId = setTimeout(() => {
				// Show notification to reload if payment not redirected
				showNotification(NotificationType.ReloadPage, t);
			}, 10000);

			// Clear the timeout if payment is successful and redirected
			return () => clearTimeout(timeoutId);
		} catch (error) {
			console.log(error);
		}
	};

	//map response from api with name, color and image
	const mappedPaymentOptions = paymentOptions?.map((paymentOptionName) => {
		//Get config for payment option by name
		const paymentOptionConfig = config.find(
			(x) => x.name.toLowerCase() === paymentOptionName.toLowerCase()
		);

		return (
			<PaymentSelectOption
				key={paymentOptionConfig?.name as string}
				name={paymentOptionConfig?.name as string}
				/* color="#FFFFFF"  */
				color={paymentOptionConfig?.color as string}
				icon={paymentOptionConfig?.icon as string}
				setPaymentProvider={setPaymentProvider}
				selected={paymentProvider === paymentOptionConfig?.name}
			/>
		);
	});

	return (
		<Paper
			radius="md"
			p="xl"
			color="blue"
			shadow="md"
			className={styles.paymentOptions}
		>
			<Text
				p="md"
				pl="0"
				style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
				color={mantineConfig.mantine.text.color}
				size={mantineConfig.mantine.text.payment.fontSize}
				weight={mantineConfig.mantine.text.fontWeight}
			>
				<FontAwesomeIcon
					icon={faFileShield}
					beatFade
					size="sm"
					style={{ color: '#05a98b' }}
				/>{' '}
				{t('tr.payment-options')}{' '}
				<FontAwesomeIcon
					icon={faCircleCheck}
					size="sm"
					style={{ color: '#05a98b' }}
				/>
			</Text>

			<Stack justify="flex-start" className={styles.paymentOptionContainer}>
				{paymentOptions ? (
					mappedPaymentOptions
				) : (
					<p
						style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
						color={mantineConfig.mantine.text.color}
					>
						{t('tr.is-loading')}
					</p>
				)}
			</Stack>

			<Flex
				direction="row"
				justify="space-between"
				align="center"
				mt="xs"
				pt="md"
			>
				<Button
					onClick={previousStep}
					leftIcon={
						<IconCaretLeft size={mantineConfig.mantine.button.iconSize} />
					}
					color={mantineConfig.mantine.button.back.backgroundColor}
					className={styles.goHideDesktop}
					style={{
						color: mantineConfig.mantine.button.fontColor,
					}}
				>
					{`${t('tr.back').toUpperCase()}`}
				</Button>
				<Button
					className={styles.payBtn}
					color={mantineConfig.mantine.button.backgroundColor}
					disabled={!paymentProvider || isLoading}
					sx={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
					onClick={() => handlePayment()}
				>
					{`${t('tr.pay-now').toUpperCase()}`}
				</Button>
			</Flex>
		</Paper>
	);
};

const persistPaymentInfoToCookies = ({
	paymentInfo,
}: {
	paymentInfo: IPaymentInfo;
}) => {
	Cookies.set('payment_info', JSON.stringify(paymentInfo), { expires: 1 });
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
		case 'paystack':
			const paystack: IPaystackPayment = {
				transactionUrl: data.transactionUrl,
			};

			paymentInfo.data = paystack;
			break;
		case 'stripe':
			const stripe: IStripePayment = {
				clientSecret: data.clientSecret,
			};

			paymentInfo.data = stripe;
			break;
		case 'wallet':
			
			break;
		default:
			console.log('error: ' + paymentInfo.paymentProvider);
			break;
	}

	return paymentInfo;
};

export default PaymentSelect;
