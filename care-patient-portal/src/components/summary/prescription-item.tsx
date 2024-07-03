import {
	Box,
	Card,
	Flex,
	Image,
	SimpleGrid,
	Text,
	Title,
	createStyles,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import empty from '../../assets/images/empty.svg';
import useProfile from '../../hooks/use-profile';
import useSummary from '../../hooks/use-summary';
import Container from '../layout/container';
import { formatDate } from '../../utils';
import PageTitle from '../core/page-title';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
import dayjs from 'dayjs';
interface PrescriptionItemProps {
	consultationId?: number;
	individualPrescriptionId?: number;
}
const PrescriptionItem = ({
	consultationId,
	individualPrescriptionId,
}: PrescriptionItemProps) => {
	const { user } = useProfile();
	const { getPrescriptionById } = useSummary();
	const { data: prescriptions } = getPrescriptionById(consultationId);
	const { t } = useTranslation(['default']);
	const { classes } = useStyles();

	if (!prescriptions) {
		return null;
	}

	const filteredPrescriptions = prescriptions.filter(
		(item) => item.id === individualPrescriptionId
	);
	const treatmentDuration =
		filteredPrescriptions[0].treatmentDuration.split(',');
	return (
		<Container>
			<PageTitle heading={`${t('tr.prescription-details')}`} />
			{filteredPrescriptions?.map((presc) => (
				<Card
					maw={1050}
					w="100%"
					mt="3vh"
					key={presc.id}
					p="md"
					className={classes.flexClass}
				>
					<Card.Section p="md" bg="teal" />

					<Title my="xs" order={2}>
						{t('tr.prescription')}
					</Title>
					<SimpleGrid
						spacing="sm"
						cols={2}
						breakpoints={[{ maxWidth: 800, cols: 1, spacing: 'sm' }]}
					>
						<Box p="xs" fw={700}>
							<Text
								color={mantineConfig.mantine.title.color}
								size={mantineConfig.mantine.title.fontSize}
								weight={mantineConfig.mantine.title.fontWeight}
							>
								{t('tr.medication')}
							</Text>
							<Text
								style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
								color={mantineConfig.mantine.text.color}
								size={mantineConfig.mantine.text.fontSize}
								weight={mantineConfig.mantine.text.fontWeight}
							>
								{presc?.medicationName} {presc?.medicationStrength}
							</Text>
						</Box>

						<Box p="xs" fw={700}>
							<Text
								color={mantineConfig.mantine.title.color}
								size={mantineConfig.mantine.title.fontSize}
								weight={mantineConfig.mantine.title.fontWeight}
							>
								{t('tr.medication-quantity')}
							</Text>
							<Text
								style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
								color={mantineConfig.mantine.text.color}
								size={mantineConfig.mantine.text.fontSize}
								weight={mantineConfig.mantine.text.fontWeight}
							>
								1 x {presc?.quantity} {t('tr.per-package')}
							</Text>
						</Box>

						<Box p="xs" fw={700}>
							<Text
								color={mantineConfig.mantine.title.color}
								size={mantineConfig.mantine.title.fontSize}
								weight={mantineConfig.mantine.title.fontWeight}
							>
								{t('tr.medication-form')}
							</Text>
							<Text
								style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
								color={mantineConfig.mantine.text.color}
								size={mantineConfig.mantine.text.fontSize}
								weight={mantineConfig.mantine.text.fontWeight}
							>
								{presc?.medicationType}
							</Text>
						</Box>

						<Box p="xs" fw={700}>
							<Text
								color={mantineConfig.mantine.title.color}
								size={mantineConfig.mantine.title.fontSize}
								weight={mantineConfig.mantine.title.fontWeight}
							>
								{t('tr.medication-dosage')}
							</Text>
							<Text
								style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
								color={mantineConfig.mantine.text.color}
								size={mantineConfig.mantine.text.fontSize}
								weight={mantineConfig.mantine.text.fontWeight}
							>
								{presc?.dosage} {presc?.medicationType} / {presc?.frequency} {t('tr.a-day')}{' '}
							</Text>
						</Box>

						<Box p="xs">
							<Text
								color={mantineConfig.mantine.title.color}
								size={mantineConfig.mantine.title.fontSize}
								weight={mantineConfig.mantine.title.fontWeight}
							>
								{t('tr.medication-for')}
							</Text>
							<Text
								color={mantineConfig.mantine.text.color}
								size={mantineConfig.mantine.text.fontSize}
								weight={mantineConfig.mantine.text.fontWeight}
							>
								{presc?.illness}
							</Text>
						</Box>

						<Box p="xs">
							<Text
								color={mantineConfig.mantine.title.color}
								size={mantineConfig.mantine.title.fontSize}
								weight={mantineConfig.mantine.title.fontWeight}
							>
								{t('tr.prescription-issued')}
							</Text>
							<Text
								style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
								color={mantineConfig.mantine.text.color}
								size={mantineConfig.mantine.text.fontSize}
								weight={mantineConfig.mantine.text.fontWeight}
							>
								{formatDate(presc?.issueDate)}
							</Text>
						</Box>

						<Box p="xs">
							<Text
								color={mantineConfig.mantine.title.color}
								size={mantineConfig.mantine.title.fontSize}
								weight={mantineConfig.mantine.title.fontWeight}
							>
								{t('tr.valid-until')}
							</Text>
							<Text
								style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
								color={mantineConfig.mantine.text.color}
								size={mantineConfig.mantine.text.fontSize}
								weight={mantineConfig.mantine.text.fontWeight}
							>
								{t('tr.from')}: {dayjs(treatmentDuration[0]).format('YYYY-MM-DD')}
							</Text>
							<Text
								style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
								color={mantineConfig.mantine.text.color}
								size={mantineConfig.mantine.text.fontSize}
								weight={mantineConfig.mantine.text.fontWeight}
							>
								{t('tr.to')}: {dayjs(treatmentDuration[1]).format('YYYY-MM-DD')}
							</Text>
						</Box>

						<Box p="xs">
							<Text
								color={mantineConfig.mantine.title.color}
								size={mantineConfig.mantine.title.fontSize}
								weight={mantineConfig.mantine.title.fontWeight}
							>
								{t('tr.prescription-recipient')}
							</Text>
							<Text>
								{
									<Text
										style={{
											fontFamily: mantineConfig.mantine.global.fontFamily,
										}}
										color={mantineConfig.mantine.text.color}
										size={mantineConfig.mantine.text.fontSize}
										weight={mantineConfig.mantine.text.fontWeight}
									>{presc.recipientName}
									</Text>
								}
							</Text>
						</Box>

						<Box p="xs">
							<Text
								color={mantineConfig.mantine.title.color}
								size={mantineConfig.mantine.title.fontSize}
								weight={mantineConfig.mantine.title.fontWeight}
							>
								{t('tr.issued-by')}
							</Text>
							<Text
								style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
								color={mantineConfig.mantine.text.color}
								size={mantineConfig.mantine.text.fontSize}
								weight={mantineConfig.mantine.text.fontWeight}
							>
								Dr. {presc?.issuerName}
							</Text>
						</Box>
					</SimpleGrid>
				</Card>
			))}
			{prescriptions?.length === 0 && (
				<Flex
					mt="3rem"
					gap="2rem"
					direction="column"
					align="center"
					justify="center"
				>
					<Image
						style={{ width: 240, marginLeft: 'auto', marginRight: 'auto' }}
						radius="md"
						src={empty}
						alt="Random unsplash image"
					/>
					<Title align="center" order={3}>
						{t(
							'tr.iam-sorry-it-appears-that-there-isnot-a-prescription-on-record-that-matches-you.'
						)}
					</Title>
				</Flex>
			)}
		</Container>
	);
};

const useStyles = createStyles(() => ({
	flexClass: {
		background: '#fff',
		borderRadius: 8,
		padding: 16,
		boxShadow: '0px 0px 5px #C0C0C0',
	},
}));
export default PrescriptionItem;
