import { Box, Flex, Text, createStyles } from '@mantine/core';
// import useProfile from '../../hooks/use-profile';
import useReceipt from '../../hooks/use-receipt';
import Container from '../layout/container';
import { useTranslation } from 'react-i18next';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
import { formatDate } from '../../utils';
import useProvider from '../../hooks/use-provider'; 


const ReceiptItem = ({ id }: { id?: number }) => {
	const { t } = useTranslation(['default']);
	const { provider } = useProvider();
	const { receipt, currency } = useReceipt(Number(id));

	console.log('Receipt:', receipt);

	const formatTime = (date: string | Date) => {
		const d = new Date(date);
		const hours = ('0' + d.getHours()).slice(-2);
		const minutes = ('0' + d.getMinutes()).slice(-2);
		return `${hours}:${minutes}`;
	};

	const { classes } = useStyles();
	return (
		<Container>
			<Flex
				mt="xl"
				pos="relative"
				className={classes.shadowClass}
				maw={1050}
				px="30px"
				w="100%"
				direction="column"
			>
				<Box
					p="md"
					bg="teal"
					w="100%"
					pos="absolute"
					className={classes.topBar}
				/>
				<Box mb={30} mt={30}>
					<Text
						color={mantineConfig.mantine.title.color}
						size={mantineConfig.mantine.title.fontSize}
						weight={mantineConfig.mantine.title.fontWeight}
					>
						{t('tr.patient-name').toUpperCase()}
					</Text>
					<Text
						color={mantineConfig.mantine.text.color}
						size={mantineConfig.mantine.text.fontSize}
						weight={mantineConfig.mantine.text.fontWeight}
					>
						{receipt?.patientName}
					</Text>
				</Box>

				{/* <Box mb={30}> */}
					{/* <Text
						color={mantineConfig.mantine.title.color}
						size={mantineConfig.mantine.title.fontSize}
						weight={mantineConfig.mantine.title.fontWeight}
					>
						{t('tr.personalID').toUpperCase()}
					</Text> */}
					{/* <Text
						color={mantineConfig.mantine.text.color}
						size={mantineConfig.mantine.text.fontSize}
						weight={mantineConfig.mantine.text.fontWeight}
					>
						{receipt?.patientNationalIdNumber}
					</Text> */}
				{/* </Box> */}

				<Box mb={30}>
					<Text
						color={mantineConfig.mantine.title.color}
						size={mantineConfig.mantine.title.fontSize}
						weight={mantineConfig.mantine.title.fontWeight}
					>
						{t('tr.time-of-appointment').toUpperCase()}
					</Text>
					{receipt ? (
						<Text
							color={mantineConfig.mantine.text.color}
							size={mantineConfig.mantine.text.fontSize}
							weight={mantineConfig.mantine.text.fontWeight}
						>
							<div>
								{t('tr.date')}: {formatDate(receipt.timeAccepted)} <br />
								{t('tr.duration')}: {formatTime(receipt.timeAccepted)} to{' '}
								{formatTime(receipt.timeFinished)}
							</div>
							{/* {formatDate(receipt.timeAccepted)} -
							{formatDate(receipt.timeFinished)} */}
						</Text>
					) : undefined}
				</Box>

				<Box mb={30}>
					<Text
						color={mantineConfig.mantine.title.color}
						size={mantineConfig.mantine.title.fontSize}
						weight={mantineConfig.mantine.title.fontWeight}
					>
						{t('tr.paid').toUpperCase()}
					</Text>
					{/* Hardcoded currency */}
					<Text
						color={mantineConfig.mantine.text.color}
						size={mantineConfig.mantine.text.fontSize}
						weight={mantineConfig.mantine.text.fontWeight}
					>
						{currency
							? `${currency} ${receipt?.amountPaid}`
							: 'Unknown Currency'}
					</Text>
				</Box>
				{/* Need to be dynamic */}
				{/* <Box mb={30}> */}
				{/* <Text
						color={mantineConfig.mantine.title.color}
						size={mantineConfig.mantine.title.fontSize}
						weight={mantineConfig.mantine.title.fontWeight}
					> */}
				{/* {t('tr.payment-time').toUpperCase()} */}
				{/* </Text> */}

				{/* Hardcoded date and time */}
				{/* <Text
						color={mantineConfig.mantine.text.color}
						size={mantineConfig.mantine.text.fontSize}
						weight={mantineConfig.mantine.text.fontWeight}
					> */}
				{/* 08.37 - Aug 15, 2022 */}
				{/* </Text> */}
				{/* </Box> */}

				<Box mb={30}>
					<Text
						color={mantineConfig.mantine.title.color}
						size={mantineConfig.mantine.title.fontSize}
						weight={mantineConfig.mantine.title.fontWeight}
					>
						{t('tr.healthcare-provider').toUpperCase()}
					</Text>
					<Text
						color={mantineConfig.mantine.text.color}
						size={mantineConfig.mantine.text.fontSize}
						weight={mantineConfig.mantine.text.fontWeight}
					>
						{provider ? provider.providerName : 'No provider available'}
					</Text>
				</Box>

				<Box mb={30}>
					<Text
						color={mantineConfig.mantine.title.color}
						size={mantineConfig.mantine.title.fontSize}
						weight={mantineConfig.mantine.title.fontWeight}
					>
						{/* {t('tr.powered-by').toUpperCase()} */}
					</Text>
					<Text
						color={mantineConfig.mantine.text.color}
						size={mantineConfig.mantine.text.fontSize}
						weight={mantineConfig.mantine.text.fontWeight}
					>
						{/* {t(
							'tr.the-medical-appointment-is-delivered-by-carelyo-healthcare-system'
						)}
						.{' '} */}
					</Text>
				</Box>
			</Flex>
		</Container>
	);
};
const useStyles = createStyles((theme) => ({
	shadowClass: {
		background: '#fff',
		borderRadius: 8,
		padding: 16,
		boxShadow: '0px 0px 5px #C0C0C0',
	},
	topBar: {
		borderTopRightRadius: theme.radius.md,
		borderTopLeftRadius: theme.radius.md,
		top: 0,
		left: 0,
	},
}));
export default ReceiptItem;
