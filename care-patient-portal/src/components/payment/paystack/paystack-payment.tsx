import { Paper } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IPaystackPayment } from '../../../api/types';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import {
	showNotification,
	NotificationType,
} from '../../../utils/notification';

const PaystackPayment: React.FC<{
	paystackPayment: IPaystackPayment;
	setVerify: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ paystackPayment, setVerify }) => {
	const { t } = useTranslation(['default']);

	useEffect(() => {
		//MessageEvent is for communicating with the our code and the iframe's code.
		//Iframe sets its data then its checked for status and a notification is shown
		//If status is success then we setVerify to true so useQuery is run in verify-payment to verify that it succeeded on the server side as well
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
			//Return if data is undefined
			if (!ev.data.data) return;

			//Return if status doesn't exist in data
			if (!('status' in ev.data.data)) return;

			switch (ev.data.data.status) {
				case 'success':
					showNotification(NotificationType.PaymentSuccess, t);

					setVerify(true);
					break;
				case 'cancelled': //Unable to trigger this
					showNotification(NotificationType.PaymentCancelled, t);

					Cookies.remove('trInfo');
					break;
				case 'failed': //Unable to trigger this
					showNotification(NotificationType.PaymentFailed, t);

					Cookies.remove('trInfo');
					break;
				default:
					showNotification(NotificationType.PaymentError, t);
					break;
			}
		};

		window.addEventListener('message', handler);

		return () => window.removeEventListener('message', handler);
	}, []);

	return (
		<Paper
			h={'calc(100vh - 100px)'}
			p={0}
			m={0}
			withBorder
			component="iframe"
			name={`${t('waiting-for-payment')}`}
			src={paystackPayment.transactionUrl}
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
	);
};

export default PaystackPayment;
