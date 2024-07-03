import Cookies from 'js-cookie';
import {
	IPaymentInfo,
	IPaystackPayment,
	IStripePayment,
	IVerifyPaymentRequest,
} from '../../api/types';
import { Container, Stack, Title } from '@mantine/core';
import { useState, useLayoutEffect, useEffect } from 'react';
import { useGuardedNavigation } from '../navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { routes } from '../../api/routes';
import { useTranslation } from 'react-i18next';
import StripePayment from '../../components/payment/stripe/stripe-payment';
import PaystackPayment from '../../components/payment/paystack/paystack-payment';
import WalletPayment from '../../components/payment/wallet/wallet-payment';
import LoadingIndicator from '../../components/loading-indicator';
import { showNotification, NotificationType } from '../../utils/notification';

export const Payment = () => {
	const [verify, setVerify] = useState(false);
	const { navigate } = useGuardedNavigation();
	const { t } = useTranslation(['default']);
	const queryClient = useQueryClient();

	//Get IPaymentInfo from cookies set in booking-summery
	const paymentInfo = JSON.parse(
		Cookies.get('payment_info') as string
	) as IPaymentInfo;

	//Calls the api to verify that the payment went through when verify is set to true
	const { data, isLoading, isInitialLoading, isError, status } = useQuery(
		['verifyPayment'],
		() => routes.verifyPayment(GetVerifyPaymentRequest(paymentInfo)),
		{
			enabled: verify,
			cacheTime: 0, //cacheTime should be 0 or else it persists the error state
		}
	);

	useLayoutEffect(() => {
		//If api request failed then show error notification and navigate home
		if (isError && !isInitialLoading) {
			showNotification(NotificationType.ApiError, t);

			Cookies.remove('payment_info');
			navigate('home');
		}

		if (typeof data?.status === 'undefined') return;

		//Check status from api and navigate
		switch (data?.status) {
			case 'success':
				navigate('waitingroom');
				break;
			case 'failed':
				navigate('home');
				break;
			default:
				showNotification(NotificationType.ApiError, t);
				break;
		}

		//??
		if (data && !isError && !isInitialLoading) {
			Cookies.remove('payment_info');
			void queryClient.invalidateQueries(['getProfile']);
		}
	}, [data, isError, isInitialLoading]);

	return (
		<Container>
			<Stack spacing={1} w="100%">
				{{
					stripe: (
						<StripePayment
							stripePayment={paymentInfo.data as IStripePayment}
							setVerify={setVerify}
						/>
					),
					paystack: (
						<PaystackPayment
							paystackPayment={paymentInfo.data as IPaystackPayment}
							setVerify={setVerify}
						/>
					),
					wallet: <WalletPayment setVerify={setVerify} />,
				}[paymentInfo.paymentProvider] || <LoadingIndicator />}
			</Stack>
		</Container>
	);
};

let GetVerifyPaymentRequest: (
	paymentInfo: IPaymentInfo
) => IVerifyPaymentRequest = function (
	paymentInfo: IPaymentInfo
): IVerifyPaymentRequest {
	const verifyPaymentRequest: IVerifyPaymentRequest = {
		referenceId: paymentInfo.referenceId,
		paymentProvider: paymentInfo.paymentProvider,
	};

	return verifyPaymentRequest;
};
