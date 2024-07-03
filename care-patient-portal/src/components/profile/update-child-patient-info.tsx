import { Accordion, ActionIcon, Badge, Button, Flex, Group, NumberInput, Select, Slider, Space, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import useMutation from '../../hooks/use-children';
import { useTranslation } from 'react-i18next';
import { IChildrenResponse } from '../../api/types';
import { IconUser } from '@tabler/icons-react';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
import { formatDateByDOB } from '../../utils';
import { PATIENT_HEIGHT, PATIENT_WEIGHT } from '../../constants';

const UpdateChildPatientInfo = ({
	child
}: {
	child: IChildrenResponse;
}) => {
	const { t } = useTranslation(['default']);
	const { updateChild } = useMutation();
	const form = useForm({
		initialValues: {
			bloodType: child?.polygenic.bloodType ? child.polygenic.bloodType : '',
			heightCm: child?.polygenic.heightCm ? child.polygenic.heightCm : 0,
			weightKg: child?.polygenic.weightKg ? child.polygenic.weightKg : 0,
		},
		validate: {
			bloodType: (value) =>
				value.length < 2 ? t('tr.please-select-blood-type') : null,
			heightCm: (value) => (value < 1 ? t('tr.please-select-height') : null),
			weightKg: (value) => (value < 1 ? t('tr.please-select-weight') : null),
		},
	});

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
								polygenic: {
									bloodType: values.bloodType,
									heightCm: values.heightCm,
									weightKg: values.weightKg
								},
								childId: child.childId
							});
							form.resetDirty();
						})}
					>
						<Title
							mb={'sm'}
							color={mantineConfig.mantine.input.label.color}
							size={mantineConfig.mantine.input.label.fontSize}
							weight={mantineConfig.mantine.input.label.fontWeight}
						>
							{t('tr.blood-type')}{' '}
						</Title>
						<Select
							size={mantineConfig.mantine.input.size}
							nothingFound="No options"
							mb={'sm'}
							defaultValue={child?.polygenic.bloodType}
							placeholder={`${t('tr.pick-one')}`}
							data={[
								{ value: 'I dont know', label: `${t('tr.i-dont-know')}` },
								{ value: 'A+', label: 'A+' },
								{ value: 'A-', label: 'A-' },
								{ value: 'B+', label: 'B+' },
								{ value: 'B-', label: 'B-' },
								{ value: 'O+', label: 'O+' },
								{ value: 'O-', label: 'O-' },
								{ value: 'AB+', label: 'AB+' },
								{ value: 'AB-', label: 'AB-' },
							]}
							{...form.getInputProps('bloodType')}
						/>
						<Title
							mb={'sm'}
							color={mantineConfig.mantine.input.label.color}
							size={mantineConfig.mantine.input.label.fontSize}
							weight={mantineConfig.mantine.input.label.fontWeight}
						>
							{t('tr.height')}
						</Title>
						<NumberInput
							size={mantineConfig.mantine.input.size}
							min={40}
							max={260}
							{...form.getInputProps('heightCm')}
						/>
						<Space h="xs" />

						<Slider
							label={(value) => `${value}cm`}
							min={40}
							mb={'xl'}
							max={260}
							marks={PATIENT_HEIGHT}
							{...form.getInputProps('heightCm')}
						/>
						<Title
							mb={'sm'}
							color={mantineConfig.mantine.input.label.color}
							size={mantineConfig.mantine.input.label.fontSize}
							weight={mantineConfig.mantine.input.label.fontWeight}
						>
							{t('tr.weight')}
						</Title>
						<NumberInput
							size={mantineConfig.mantine.input.size}
							min={1}
							max={500}
							{...form.getInputProps('weightKg')}
						/>
						<Space h="xs" />

						<Slider
							label={(value) => `${value}kg`}
							mb={35}
							min={1}
							max={500}
							marks={PATIENT_WEIGHT}
							{...form.getInputProps('weightKg')}
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

export default UpdateChildPatientInfo;
