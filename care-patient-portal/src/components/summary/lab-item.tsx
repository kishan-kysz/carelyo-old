import { Box, Divider, Text } from '@mantine/core';
import useLabresults from '../../hooks/use-labresults';
import Container from '../layout/container';
import { useTranslation } from 'react-i18next';
import mantineConfig from '../../assets/styles/config/mantine.config.json';

const LabItem = ({ id }: { id?: number }) => {
	const { t } = useTranslation(['default']);
	const { labResults } = useLabresults(id);

	return (
		<Container>
			{labResults
				? labResults?.map((lab) => (
						<Text maw={400} style={{ width: '100%' }} mt="5vh" key={lab.id}>
							<Box w="100%" mb={30}>
								<Text fz="xl" fw={700}>
									{t('tr.doctor').toUpperCase()}
								</Text>
								<Text fz="xl" fw={400}>
									Dr. {lab.doctorName}
								</Text>
								<Divider my="sm" />
							</Box>

							<Box mb={30}>
								<Text fz="xl" fw={700}>
									{t('tr.reason-for-appointment').toUpperCase()}
								</Text>
								<Text fz="xl" fw={400}>
									{lab.reason}
								</Text>
								<Divider my="sm" />
							</Box>

							<Box mb={30}>
								<Text fz="xl" fw={700}>
									{t('tr.categories-of-lab-tests').toUpperCase()}
								</Text>
								<Text fz="xl" fw={400}>
									{lab.test}
								</Text>
								<Divider my="sm" />
							</Box>
						</Text>
					))
				: undefined}
		</Container>
	);
};

export default LabItem;
