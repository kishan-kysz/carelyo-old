import { Button, Group, NumberInput, Pagination, Select, Slider, Space, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import useProfile from '../../hooks/use-profile';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
import { Flex, Tabs } from '@mantine/core';
import { Fragment, useState } from 'react';
import { IconBabyCarriage, IconUser } from '@tabler/icons-react';
import { PATIENT_HEIGHT, PATIENT_WEIGHT } from '../../constants';
import useChildren from '../../hooks/use-children';
import UpdateChildPatientInfo from './update-child-patient-info';

const PatientInfo = () => {

	const { t } = useTranslation(['default']);
	const { user, updateProfile } = useProfile();
	const { activeChildren } = useChildren();
	
	const [active, setActive] = useState(0);
	const [activePage, setPage] = useState(1);
	const [cardPerPage] = useState(3);
	const indexOfLastCard = activePage * cardPerPage;
	const indexOfFirstCard = indexOfLastCard - cardPerPage;
	const form = useForm({
		initialValues: {
			bloodType: user?.polygenic.bloodType ? user.polygenic.bloodType : '',
			heightCm: user?.polygenic.heightCm ? user.polygenic.heightCm : 0,
			weightKg: user?.polygenic.weightKg ? user.polygenic.weightKg : 0,
		},
		validate: {
			bloodType: (value) =>
				value.length < 2 ? t('tr.please-select-blood-type') : null,
			heightCm: (value) => (value < 1 ? t('tr.please-select-height') : null),
			weightKg: (value) => (value < 1 ? t('tr.please-select-weight') : null),
		},
	});
	const pageNumbers = [];
	for (let i = 0; i < Math.ceil(activeChildren == undefined ? 0 : activeChildren.length / cardPerPage); i++) {
		pageNumbers.push(i);
	}

	return (
		<Fragment>
			<Tabs
				color="teal.8"
				variant="pills"
				radius="xl"
				defaultValue="patientInfo"
			>
				<Flex
					mih={50}
					justify="center"
					align="center"
					direction="row"
					wrap="wrap"
				>
					<Tabs.List>
						<Flex
							gap="xs"
							justify="center"
							align="center"
							direction="row"
							wrap="wrap"
						>
							<Tabs.Tab
								value="patientInfo"
								icon={<IconUser size="0.8rem" />}
								sx={{ border: '1px solid #CED4DA' }}
							>
								{t('tr.patient')}
							</Tabs.Tab>
							<Tabs.Tab
								value="childrenInfo"
								icon={<IconBabyCarriage size="0.8rem" />}
								sx={{ border: '1px solid #CED4DA' }}
							>
								{t('tr.children')}
							</Tabs.Tab>
						</Flex>
					</Tabs.List>
				</Flex>
				<Tabs.Panel value="patientInfo" pt="xs">
					<form
						onSubmit={form.onSubmit(async (values) => {
							await updateProfile({
									bloodType: values.bloodType,
									heightCm: values.heightCm,
									weightKg: values.weightKg,
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
							defaultValue={user?.polygenic.bloodType}
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
				</Tabs.Panel>

				<Tabs.Panel value="childrenInfo" pt="xs">
					{activeChildren && activeChildren.map(child => (
						<UpdateChildPatientInfo key={child.childId} child={child} />
					))?.slice(indexOfFirstCard, indexOfLastCard)}

					{activeChildren && activeChildren.length > 3 && (
						<Pagination
							mt={50}
							mb={30}
							m={20}
							position="center"
							noWrap={false}
							withEdges={true}
							value={activePage}
							onChange={setPage}
							total={pageNumbers.length}
						/>
					)}
				</Tabs.Panel>
			</Tabs>
		</Fragment>
	);

};

export default PatientInfo;
