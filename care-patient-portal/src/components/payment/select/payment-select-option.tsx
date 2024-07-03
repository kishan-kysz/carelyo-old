import React from 'react';
import { Flex, Group, Image, Paper, Stack, Text } from '@mantine/core';
import styles from './payment-option.module.css';
import mantineConfig from '../../../assets/styles/config/mantine.config.json';

/*
    Only logic implemented, styling to be done later.
*/
interface IPaymentSelectOption {
	name: string;
	color: string;
	icon: string;
	setPaymentProvider: React.Dispatch<React.SetStateAction<string | undefined>>;
	selected: boolean;
}

const PaymentSelectOption: React.FC<IPaymentSelectOption> = (
	paymentSelectOption
) => {
	return (
		<Paper
			className={styles.paymentOption}
			style={{
				border: paymentSelectOption.selected
					? `1px solid ${paymentSelectOption.color}`
					: `1px solid #ebeef0`,
				cursor: 'pointer',

				backgroundColor: paymentSelectOption.selected ? '#eee' : '#ffffff',
			}}
			radius="md"
			onClick={() => {
				paymentSelectOption.setPaymentProvider(paymentSelectOption.name);
			}}
		>
			<Group>
				<Image
					p={10}
					width={30}
					height={30}
					fit="contain"
					src={paymentSelectOption.icon}
				/>
				<Text
					style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
					color={mantineConfig.mantine.text.color}
					size={mantineConfig.mantine.text.fontSize}
					weight={mantineConfig.mantine.text.fontWeight}
				>
					{paymentSelectOption.name}
				</Text>
			</Group>
		</Paper>
	);
};

export default PaymentSelectOption;
