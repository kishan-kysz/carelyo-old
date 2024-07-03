import { Accordion, ActionIcon, Badge, Button, Flex, Group, MultiSelect, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import useMutation from '../../hooks/use-children';
import { useTranslation } from 'react-i18next';
import { IChildrenResponse } from '../../api/types';
import { IconUser } from '@tabler/icons-react';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
import { formatDateByDOB } from '../../utils';
import { PATIENT_ALLERGIES, PATIENT_DISABILITIES, PATIENT_MEDICAL_PROBLEMS } from '../../constants';

const UpdateChildMedicalInfo = ({
	child
}: {
	child: IChildrenResponse;
}) => {
	const { t } = useTranslation(['default']);
	const { updateChild } = useMutation();
	const form = useForm({
		initialValues: {
			allergies: child?.allergies,
			disabilities: child?.disabilities,
			medicalProblems: child?.medicalProblems,
		},
		validate: {
			allergies: (value) => (value ? null : t('tr.please-select-allergies')),
			disabilities: (value) =>
				value ? null : t('tr.please-select-disabilities'),
			medicalProblems: (value) =>
				value ? null : t('tr.please-select-medical-problems'),
		},
	});

	const handleMedicalInfo = (array: string[], data: string) => {
		if (array.length === 1 && array.includes('None')) {
			array = array.filter((data) => data.includes('None'));
		} else {
			array = array.filter((data) => !data.includes('None'));
		}
		switch (data) {
			case 'disabilities':
				return form.setFieldValue('disabilities', array);
			case 'allergies':
				return form.setFieldValue('allergies', array);
			case 'medicalProblems':
				return form.setFieldValue('medicalProblems', array);
			default:
				return array;
		}
	};

	return (
		<Accordion
			key={child.childId}
			variant="contained"
			radius="md"
			mt={20}
			sx={(theme) => ({
				backgroundColor:
					theme.colorScheme === 'dark'
						? theme.colors.dark[7]
						: theme.white,
				transition: 'transform 200ms ease, box-shadow 100ms ease',
				borderRadius: '10px',
				'&:hover': {
					boxShadow: theme.shadows.md,
					transform: 'scale(1.0001)',
					borderRadius: '10px',
					'&::before': {
						borderRadius: '25px 0 0 25px',
						content: '""',
						position: 'absolute',
						top: 0,
						bottom: 0,
						left: 0,
						width: 6,
						backgroundImage: theme.fn.linearGradient(
							2,
							theme.colors.teal[9],
							theme.colors.teal[5]
						),
					},
				},
			})}
		>
			<Accordion.Item value="vitals" mb={15}>
				<Accordion.Control px={10}>
					<Flex
						justify="space-between"
						align="center"
						mb={10}
						direction="row"
						wrap="wrap"
					>
						<Flex justify="center" align="center">
							<ActionIcon variant="transparent" color="teal.8" mr={5}>
								<IconUser size={20} />
							</ActionIcon>
							<Text fw={500} mr={5}>
								{child.name}
								<Text color="dimmed" size="xs">
									{child.polygenic.gender}
								</Text>

							</Text>
						</Flex>

						<Text ta={'center'} fz={12}>
							{t('tr.date-of-birth')}
							<br />
							<Badge color="teal.7" variant="outline" size="md">
								{formatDateByDOB(child.dateOfBirth)}
							</Badge>

						</Text>
					</Flex>
				</Accordion.Control>
				<Accordion.Panel>
					<form
						onSubmit={form.onSubmit(async (values) => {
							await updateChild({
								allergies: values.allergies,
								disabilities: values.disabilities,
								medicalProblems: values.medicalProblems,
								childId: child.childId
							});
							form.resetDirty();
						})}
					>
						<Title
							mb="xs"
							color={mantineConfig.mantine.input.label.color}
							size={mantineConfig.mantine.input.label.fontSize}
							weight={mantineConfig.mantine.input.label.fontWeight}
						>
							{t('tr.allergies')}
						</Title>
						<MultiSelect
							size={mantineConfig.mantine.input.size}
							searchable={true}
							nothingFound="No options"
							mb={'sm'}
							clearable={true}
							clearButtonProps={{
								'aria-label': 'Clear selection',
							}}
							placeholder={`${t('tr.pick-one')}`}
							data={PATIENT_ALLERGIES.map((option) => ({
								value: option.value,
								label: `${t(`tr.${option.label}`)}`,
							}))}
							{...form.getInputProps('allergies')}
							onChange={(e) => handleMedicalInfo(e, 'allergies')}
						/>
						<Title
							mb="xs"
							color={mantineConfig.mantine.input.label.color}
							size={mantineConfig.mantine.input.label.fontSize}
							weight={mantineConfig.mantine.input.label.fontWeight}
						>
							{t('tr.disabilities')}
						</Title>
						<MultiSelect
							size={mantineConfig.mantine.input.size}
							searchable={true}
							nothingFound="No options"
							mb={'sm'}
							placeholder={`${t('tr.pick-one')}`}
							clearButtonProps={{
								'aria-label': 'Clear selection',
							}}
							clearable={true}
							data={PATIENT_DISABILITIES.map((option) => ({
								value: option.value,
								label: `${t(`tr.${option.label}`)}`,
							}))}
							{...form.getInputProps('disabilities')}
							onChange={(e) => handleMedicalInfo(e, 'disabilities')}
						/>
						<Title
							mb="xs"
							color={mantineConfig.mantine.input.label.color}
							size={mantineConfig.mantine.input.label.fontSize}
							weight={mantineConfig.mantine.input.label.fontWeight}
						>
							{t('tr.medical-problems')}
						</Title>
						<MultiSelect
							size={mantineConfig.mantine.input.size}
							clearable={true}
							searchable={true}
							nothingFound="No options"
							clearButtonProps={{
								'aria-label': 'Clear selection',
							}}
							mb={'sm'}
							id="medicalProblems"
							placeholder={`${t('tr.pick-one')}`}
							data={PATIENT_MEDICAL_PROBLEMS.map((option) => ({
								value: option,
								label: `${t(`tr.${option}`)}`,
							}))}
							{...form.getInputProps('medicalProblems')}
							onChange={(e) => handleMedicalInfo(e, 'medicalProblems')}
						/>

						<Group grow={true} position="right" my={'md'}>
							<Button disabled={!form.isDirty()} type="submit">
								{t('tr.save-changes')}
							</Button>
						</Group>
					</form>
				</Accordion.Panel>
			</Accordion.Item>
		</Accordion>
	);
};

export default UpdateChildMedicalInfo;
