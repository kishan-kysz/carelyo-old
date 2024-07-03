import {
	Box,
	Flex,
	LoadingOverlay,
	NavLink,
	SimpleGrid,
	Text,
	Tooltip,
	createStyles,
} from '@mantine/core';
import {
	IconChevronRight,
	IconInfoCircle,
	IconMicroscope,
	IconPill,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import useSummary from '../../hooks/use-summary';
import useProfile from '../../hooks/use-profile';
import Container from '../layout/container';
import { formatDate } from '../../utils';
import { useTranslation } from 'react-i18next';
import { getPath } from '../../pages/navigation';
import mantineConfig from '../../assets/styles/config/mantine.config.json';

const SummaryItem = ({ id }: { id?: number }) => {
	const { user } = useProfile();
	const { getPrescriptionById, getSummaryById, getLabRequestsById } =
		useSummary();
	const { data: consultationSummary, isLoading } = getSummaryById(id);
	const { data: prescriptions } = getPrescriptionById(id);
	const { data: labResults } = getLabRequestsById(id);
	const { t } = useTranslation(['default']);
	const formatName = (name: string) => {
		let fullName = name.split(' ');
		return `${fullName[0].slice(0, 1)} ${fullName[1]}`;
	};
	const { classes } = useStyles();
	return (
		<Container>
			<LoadingOverlay visible={isLoading} />
			{consultationSummary && (
				<Flex
					mt="xl"
					pos="relative"
					className={classes.boxClass}
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
							{t('tr.patient-name').charAt(0).toUpperCase() +
								t('tr.patient-name').slice(1).toUpperCase()}
						</Text>
						<Text
							color={mantineConfig.mantine.text.color}
							size={mantineConfig.mantine.text.fontSize}
							weight={mantineConfig.mantine.text.fontWeight}
						>
							{consultationSummary.name}
						</Text>
					</Box>

					<Box mb={30}>
						<Text
							color={mantineConfig.mantine.title.color}
							size={mantineConfig.mantine.title.fontSize}
							weight={mantineConfig.mantine.title.fontWeight}
						>
							{t('tr.appointment-time').charAt(0).toUpperCase() +
								t('tr.appointment-time').slice(1).toUpperCase()}
						</Text>
						<Text
							color={mantineConfig.mantine.text.color}
							size={mantineConfig.mantine.text.fontSize}
							weight={mantineConfig.mantine.text.fontWeight}
						>
							{' '}
							{formatDate(consultationSummary?.timeFinished)}
						</Text>
					</Box>

					<Box mb={30}>
						<Flex justify="space-between" align="center">
							<Text fz="xl" mb={10} fw={700}>
								{t("Doctor's Notes").toUpperCase()}
							</Text>
							<Tooltip
								label={`${t(
									'services.the-diagnosis-are-set-by-the-Dr.'
								)} ${formatName(consultationSummary.doctorName)}`}
								color="teal"
								events={{ hover: true, focus: true, touch: true }}
							>
								<Text>
									<IconInfoCircle size={25} color="teal" />
								</Text>
							</Tooltip>
						</Flex>
						<SimpleGrid
							cols={2}
							breakpoints={[{ maxWidth: 800, cols: 1, spacing: ' ' }]}
						>
							<Box>
								<Text
									color={mantineConfig.mantine.title.color}
									size={mantineConfig.mantine.title.fontSize}
									weight={mantineConfig.mantine.title.fontWeight}
								>
									{t('tr.situation').toUpperCase()}
								</Text>
								<Text
									color={mantineConfig.mantine.text.color}
									size={mantineConfig.mantine.text.fontSize}
									weight={mantineConfig.mantine.text.fontWeight}
								>
									{' '}
									{consultationSummary?.sbar?.situation}
								</Text>
							</Box>
							<Box>
								<Text
									color={mantineConfig.mantine.title.color}
									size={mantineConfig.mantine.title.fontSize}
									weight={mantineConfig.mantine.title.fontWeight}
								>
									{t('tr.background').toUpperCase()}
								</Text>
								<Text
									color={mantineConfig.mantine.text.color}
									size={mantineConfig.mantine.text.fontSize}
									weight={mantineConfig.mantine.text.fontWeight}
								>
									{consultationSummary?.sbar?.background}
								</Text>
							</Box>

							<Box>
								<Text
									color={mantineConfig.mantine.title.color}
									size={mantineConfig.mantine.title.fontSize}
									weight={mantineConfig.mantine.title.fontWeight}
								>
									{t('tr.assessment').toUpperCase()}
								</Text>
								<Text
									color={mantineConfig.mantine.text.color}
									size={mantineConfig.mantine.text.fontSize}
									weight={mantineConfig.mantine.text.fontWeight}
								>
									{consultationSummary?.sbar?.assessment}
								</Text>
							</Box>

							<Box>
								<Text
									color={mantineConfig.mantine.title.color}
									size={mantineConfig.mantine.title.fontSize}
									weight={mantineConfig.mantine.title.fontWeight}
								>
									{t('tr.recommendation').toUpperCase()}
								</Text>
								<Text
									color={mantineConfig.mantine.text.color}
									size={mantineConfig.mantine.text.fontSize}
									weight={mantineConfig.mantine.text.fontWeight}
								>
									{consultationSummary?.sbar?.recommendation}
								</Text>
							</Box>

							<Box>
								<Text
									color={mantineConfig.mantine.title.color}
									size={mantineConfig.mantine.title.fontSize}
									weight={mantineConfig.mantine.title.fontWeight}
								>
									{t('tr.diagnosis')}{' '}
									<Tooltip
										label={`${t(
											'services.the-diagnosis-are-set-by-the-Dr.'
										)} ${formatName(consultationSummary.doctorName)}`}
										color="teal"
										events={{ hover: true, focus: true, touch: true }}
									>
										<IconInfoCircle size="1.3rem" color="teal" />
									</Tooltip>
								</Text>
								<Text
									color={mantineConfig.mantine.text.color}
									size={mantineConfig.mantine.text.fontSize}
									weight={mantineConfig.mantine.text.fontWeight}
								>
									{consultationSummary?.diagnosis || 'Patient diagnosis'}
								</Text>
							</Box>
						</SimpleGrid>
					</Box>

					<Box mb={30}>
						<Flex justify="space-between" align="center">
							<Text
								color={mantineConfig.mantine.title.color}
								size={mantineConfig.mantine.title.fontSize}
								weight={mantineConfig.mantine.title.fontWeight}
							>
								{t('tr.symptoms-related-symptoms').toUpperCase()}
							</Text>
						</Flex>
						<Text
							color={mantineConfig.mantine.title.color}
							size={mantineConfig.mantine.title.fontSize}
							weight={mantineConfig.mantine.title.fontWeight}
						>
							{t('tr.symptoms').toUpperCase()}
						</Text>

						<Text
							color={mantineConfig.mantine.text.color}
							size={mantineConfig.mantine.text.fontSize}
							weight={mantineConfig.mantine.text.fontWeight}
						>
							{consultationSummary.symptoms && consultationSummary.symptoms.map((symptom, index) => (
								<span key={index}>
									{symptom}
									{index !== consultationSummary.symptoms.length - 1 && ', '}
								</span>
							))}
						</Text>
						<Text
							color={mantineConfig.mantine.title.color}
							size={mantineConfig.mantine.title.fontSize}
							weight={mantineConfig.mantine.title.fontWeight}
						>
							{t('tr.related-symptoms').toUpperCase()}
						</Text>
						<Text
							color={mantineConfig.mantine.text.color}
							size={mantineConfig.mantine.text.fontSize}
							weight={mantineConfig.mantine.text.fontWeight}
						>
							{consultationSummary.relatedSymptoms && consultationSummary.relatedSymptoms.map((relatedSymptoms, index) => (
								<span key={index}>
									{relatedSymptoms}
									{index !== consultationSummary.relatedSymptoms.length - 1 && ', '}
								</span>
							))}
						</Text>
					</Box>

					<Box mb={30}>
						<Text
							color={mantineConfig.mantine.title.color}
							size={mantineConfig.mantine.title.fontSize}
							weight={mantineConfig.mantine.title.fontWeight}
						>
							{t('tr.doctor').toUpperCase()}
						</Text>
						<Text
							color={mantineConfig.mantine.text.color}
							size={mantineConfig.mantine.text.fontSize}
							weight={mantineConfig.mantine.text.fontWeight}
						>
							Dr. {consultationSummary?.doctorName}
						</Text>
					</Box>

					{prescriptions && prescriptions?.length > 0 ? (
						<NavLink
							fz="xl"
							fw={700}
							label={t('tr.prescriptions').toUpperCase()}
							rightSection={<IconChevronRight size={22} stroke={1.5} />}
							mb={10}
						>
							<Flex direction="column">
								{prescriptions?.map((prescription) => (
									<NavLink
										key={prescription.id}
										component={Link}
										label={prescription.medicationName}
										rightSection={<IconChevronRight size={22} stroke={1.5} />}
										variant="filled"
										icon={<IconPill size={15} stroke={2} color="teal" />}
										description={prescription.medicationStrength}
										to={getPath('prescription', [
											consultationSummary.consultationId.toString(),
											prescription.id.toString(),
										])}
									/>
								))}
							</Flex>
						</NavLink>
					) : undefined}
					{labResults && labResults?.length > 0 ? (
						<NavLink
							fz="xl"
							fw={700}
							label={t('tr.laboratory-test').toUpperCase()}
							rightSection={<IconChevronRight size={22} stroke={1.5} />}
							mb={10}
						>
							<Flex direction="column">
								{labResults?.map((lab) => (
									<NavLink
										key={lab.id}
										component={Link}
										label={lab.test}
										rightSection={<IconChevronRight size={22} stroke={1.5} />}
										variant="filled"
										icon={<IconMicroscope size={18} stroke={2} color="teal" />}
										to={getPath('lab', [
											consultationSummary.consultationId.toString(),
										])}
									/>
								))}
							</Flex>
						</NavLink>
					) : undefined}

					<NavLink
						fz="xl"
						mb={10}
						fw={700}
						component={Link}
						to={getPath('receipt', [
							consultationSummary.consultationId.toString(),
						])}
						label={t('tr.receipt').toUpperCase()}
						rightSection={<IconChevronRight size={22} stroke={1.5} />}
					/>
				</Flex>
			)}
		</Container>
	);
};

const useStyles = createStyles((theme) => ({
	boxClass: {
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

export default SummaryItem;
