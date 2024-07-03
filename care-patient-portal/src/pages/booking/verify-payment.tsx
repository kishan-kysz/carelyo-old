import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingIndicator from '../../components/loading-indicator';
import { useEffect, useLayoutEffect, useState } from 'react';
import { notifications, showNotification } from '@mantine/notifications';
import Cookies from 'js-cookie';
import { useGuardedNavigation } from '../navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { routes } from '../../api/routes';
import Container from '../../components/layout/container';
import { Paper, Stack, Title } from '@mantine/core';

export const VerifyPayment = () => {
	const queryClient = useQueryClient();
	const { t } = useTranslation(['default']);
	const { id } = useParams();
	const transactionUrl = Cookies.get(String(id));
	const { navigate } = useGuardedNavigation();
	const [verify, setVerify] = useState(false);
	const isWalletPayment = String(id).startsWith('wallet');

	const { data, isLoading, isInitialLoading, isError } = useQuery(
		['verifyPayment', id],
		() => routes.verifyPayment(String(id)),
		{
			enabled: verify,
		}
	);
	useLayoutEffect(() => {
		if (isWalletPayment) {
			setVerify(true);
		}
		if (data?.status === 'success') {
			navigate('waitingroom');
		}
		if (isError) {
			showNotification({
				title: t('tr.error'),
				message: t('tr.error-occured-booking'),
				color: 'red',
			});
		}
		if (data && !isError && !isInitialLoading) {
			Cookies.remove(String(id));
			void queryClient.invalidateQueries(['getProfile']);
		}
		if (!(transactionUrl || isWalletPayment || data)) {
			navigate('booking');
		}
	}, [data, isWalletPayment, id, isError, isInitialLoading, transactionUrl]);
	useEffect(() => {
		const handler = (
			ev: MessageEvent<{
				data: {
					message: string;
					redirecturl: string;
					reference: string;
					status: string;
					trans: string;
					transaction: string;
					trxref: string;
				};
				event: string;
			}>
		) => {
			if (ev?.data?.data?.status === 'success') {
				notifications.show({
					title: 'tr Successful',
					message: 'Your payment was successful',
					color: 'green',
				});
				setVerify(true);
			}
			if (ev?.data?.data?.status === 'cancelled') {
				notifications.show({
					title: 'tr Cancelled',
					message: 'Your payment was cancelled',
					color: 'red',
				});
				Cookies.remove(String(id));
			}
			if (ev?.data?.data?.status === 'failed') {
				notifications.show({
					title: 'tr Failed',
					message: 'Your payment failed',
					color: 'red',
				});
				Cookies.remove(String(id));
			}
		};
		window.addEventListener('message', handler);

		return () => window.removeEventListener('message', handler);
	}, []);

	return (
		<Container>
			<Stack spacing={1} w="100%">
				{/* <Title order={1}>Verifying payment..</Title>
				<LoadingIndicator />
				{verify && data?.status !== 'success' && !isLoading ? (
					<Title order={3} color="red">
						Payment Failed
					</Title>
				) : null}
				{isWalletPayment ? (
					<Stack>
						<Title order={3}>Verifying wallet balance..</Title>
					</Stack>
				) : null} */}
				{isWalletPayment ? (
					<center>
						<LoadingIndicator>
							<Title order={3} color="dimmed" my="md">
								{t('tr.verifying-wallet-balance')}
							</Title>
						</LoadingIndicator>
					</center>
				) : null}

				{!isWalletPayment && !!transactionUrl && !verify && (
					<Paper
						h={'calc(100vh - 100px)'}
						p={0}
						m={0}
						withBorder
						component="iframe"
						name={`${t('tr.waiting-for-payment')}`}
						src={transactionUrl}
						sx={{
							position: 'relative',
							overflow: 'hidden',
							'container container--md container--standard': {
								padding: 0,
								margin: '0 !important',
								height: '100%',
								width: '100%',
							},
						}}
					/>
				)}
			</Stack>
		</Container>
	);
};
