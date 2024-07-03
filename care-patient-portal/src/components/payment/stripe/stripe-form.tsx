import React, { useEffect, useState, FormEvent, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
	PaymentElement,
	useStripe,
	useElements,
} from '@stripe/react-stripe-js';

import { notifications } from '@mantine/notifications';
import { Button, Text, Box } from '@mantine/core';

import styles from '../../../assets/styles/components/stripePayment.module.css';
import mantineConfig from '../../../assets/styles/config/mantine.config.json';

import LoadingComponent, {
	ILoadingComponent,
	LoadingType,
} from '../../layout/LoadingComponent'; /* testetststst */
import LogoContainer from '../../layout/logoContainer';
import { set } from 'react-hook-form';
import { env } from '../../../utils/env';
const StripePaymentForm: React.FC<{
	clientSecret: string;
	setVerify: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ clientSecret, setVerify }) => {
	const stripe = useStripe();
	const elements = useElements();
	const [message, setMessage] = useState('');
	const [shouldHide, setShouldHide] = useState(false);
	const [loadingComponent, setLoadingComponent] = useState<ILoadingComponent>({
		loadingType: LoadingType.Spinning,
		show: true,
		text: undefined,
	});
	const [buttonText, setButtonText] = useState('');

	/* Glöm inte att bryta ut */
	const providerName = env.VITE_PROVIDER_NAME;
	const color = `#${env.VITE_PROVIDER_HEX_COLOR}`;
	env.VITE_PROVIDER_NAME;
	env.VITE_PROVIDER_HEX_COLOR;

	useLayoutEffect(() => {
		//If stripe is not loaded, return
		if (!stripe) {
			setShouldHide(true);
			const iLoadingComponent: ILoadingComponent = {
				loadingType: LoadingType.Default,
				show: true,
				text: undefined,
			};
			setLoadingComponent(iLoadingComponent);

			return;
		} else if (stripe) {
			setShouldHide(false);
			const iLoadingComponent: ILoadingComponent = {
				loadingType: LoadingType.Default,
				show: false,
				text: undefined,
			};
			setLoadingComponent(iLoadingComponent);
		}
		// retrieve payment intent to get amount and currency
		stripe.retrievePaymentIntent(clientSecret).then((result: any) => {
			const { paymentIntent } = result;
			setButtonText(
				`${paymentIntent?.currency.toUpperCase()} ${paymentIntent?.amount}`
			);
		});
		setShouldHide(false);
	}, [stripe]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		const iLoadingComponent: ILoadingComponent = {
			loadingType: LoadingType.Default,
			show: true,
			text: undefined,
		};
		setLoadingComponent(iLoadingComponent);
		setShouldHide(true); // Show Stripe form
		e.preventDefault();
		setMessage('');

		if (!stripe || !elements) {
			// Stripe.js hasn't yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.

			return;
		}

		const { error, paymentIntent } = await stripe.confirmPayment({
			elements,
			confirmParams: {},

			redirect: 'if_required',
		});

		if (error) {
			setMessage(error?.message as string);
			setShouldHide(true);
			const iLoadingComponent: ILoadingComponent = {
				loadingType: LoadingType.XMark,
				show: true,
				text: error?.message as string,
			};
			setLoadingComponent(iLoadingComponent);
			//timer

			setTimeout(() => {
				const iLoadingComponent: ILoadingComponent = {
					loadingType: LoadingType.XMark,
					show: false,
					text: undefined,
				};
				setLoadingComponent(iLoadingComponent);
				//timer
				setShouldHide(false);
			}, 2000);
		} else {
			switch (paymentIntent?.status) {
				case 'succeeded':
					notifications.show({
						title: 'tr Successful',
						message: 'Your payment was successful',
						color: 'green',
					});

					//set verify to true
					setVerify(true);
					//hide stripe
					setShouldHide(true);
					const iLoadingComponent: ILoadingComponent = {
						loadingType: LoadingType.CheckMark,
						show: true,
						text: 'tr Successful',
					};
					setLoadingComponent(iLoadingComponent);

					break;
				case 'processing':
					setMessage('processing');

					console.log('processing');

					break;
				case 'requires_payment_method':
					setMessage('requires_payment_method');
					break;
				case 'requires_confirmation':
					setMessage('requires_confirmation');
					break;
				/* 3D SECURE, request 3d party confirmation ie bankid */
				case 'requires_action':
					setMessage('requires_action');
					console.log('requires_action');
					break;
				case 'requires_capture':
					setMessage('requires_capture');
					break;
				case 'canceled':
					notifications.show({
						title: 'tr canceled',
						message: 'Your payment was canceled',
						color: 'yellow',
					});

					setMessage('Canceled');

					break;
				default:
					setMessage('Something went wrong.');

					break;
			}
		}
	};

	const paymentElementOptions = {
		layout: 'tabs' as const,
	};

	const { t } = useTranslation(['default']);

	return (
		<>
			{loadingComponent?.show ? (
				<LoadingComponent
					show={loadingComponent?.show as boolean}
					loadingType={loadingComponent?.loadingType as LoadingType}
					text={loadingComponent?.text as string}
				/>
			) : null}

			<form
				id="payment-form"
				style={{ display: shouldHide ? 'none' : 'block' }}
				onSubmit={handleSubmit}
				className={styles.form}
			>
				{!shouldHide && (
					<LogoContainer providerName={providerName} color={color} />
				)}

				<Text
					className={styles.enterPaymentDetailsText}
					style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
					color={mantineConfig.mantine.text.color}
					weight={mantineConfig.mantine.text.fontWeight}
				>
					{`${t('tr.enterPaymentDetails')} `}
				</Text>

				{message && <Box className={styles.paymentMessage}>{message}</Box>}
				<PaymentElement
					className={styles.paymentElement}
					options={paymentElementOptions}
				/>
				<button
					disabled={!stripe || !elements || !buttonText}
					id="submit"
					className={styles.submitButton}
					color={mantineConfig.mantine.button.backgroundColor}
				>
					<span id="button-text">
						{`${t('tr.pay')} `}

						{buttonText}
					</span>
				</button>
				<Text
					className={styles.terms}
					style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
					color={mantineConfig.mantine.text.color}
					size={mantineConfig.mantine.text.terms.fontSize}
					weight={mantineConfig.mantine.text.terms.fontWeight}
				>
					{`${t('tr.by-completeing-this-payment-you-agree-to')} `}
					<a
						href="https://stripe.com/legal"
						target="_blank"
						className={styles.hyperlink}
					>
						{`${t('tr.terms-of-service')}`}
					</a>
					{` ${t('tr.and')} `}
					<a
						href="https://stripe.com/privacy"
						target="_blank"
						className={styles.hyperlink}
					>
						{`${t('tr.privacy-policy')}`}
					</a>
					.
				</Text>
			</form>
		</>
	);
};

export default StripePaymentForm;
