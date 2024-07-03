import {
	Button,
	Flex,
	Group,
	MultiSelect,
	Pagination,
	Tabs,
	Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import useProfile from '../../hooks/use-profile';
import { IconBabyCarriage, IconUser } from '@tabler/icons-react';
import useChildren from '../../hooks/use-children';
import { Fragment } from 'react/jsx-runtime';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
import {
	PATIENT_ALLERGIES,
	PATIENT_DISABILITIES,
	PATIENT_MEDICAL_PROBLEMS,
} from '../../constants';
import UpdateChildMedicalInfo from './update-child-medical-info';
import { useState } from 'react';

const MedicalInfo = () => {
	const { t } = useTranslation(['default']);
	const { user, updateProfile } = useProfile();
	const { activeChildren } = useChildren();

	const [active, setActive] = useState(0);
	const [activePage, setPage] = useState(1);
	const [cardPerPage] = useState(3);
	const indexOfLastCard = activePage * cardPerPage;
	const indexOfFirstCard = indexOfLastCard - cardPerPage;
	
	const pageNumbers = [];
	for (let i = 0; i < Math.ceil(activeChildren == undefined ? 0 : activeChildren.length / cardPerPage); i++) {
		pageNumbers.push(i);
	}

	const form = useForm({
		initialValues: {
			allergies: user?.allergies,
			disabilities: user?.disabilities,
			medicalProblems: user?.medicalProblems,
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
		<Fragment>
			<Tabs
				color="teal.8"
				variant="pills"
				radius="xl"
				defaultValue="patientMedInfo"
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
								value="patientMedInfo"
								icon={<IconUser size="0.8rem" />}
								sx={{ border: '1px solid #CED4DA' }}
							>
								{t('tr.patient')}
							</Tabs.Tab>
							<Tabs.Tab
								value="childrenMedInfo"
								icon={<IconBabyCarriage size="0.8rem" />}
								sx={{ border: '1px solid #CED4DA' }}
							>
								{t('tr.children')}
							</Tabs.Tab>
						</Flex>
					</Tabs.List>
				</Flex>
				<Tabs.Panel value="patientMedInfo" pt="xs">
					<form
						onSubmit={form.onSubmit(async (values) => {
							await updateProfile({
								allergies: values.allergies,
								disabilities: values.disabilities,
								medicalProblems: values.medicalProblems,
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
				</Tabs.Panel>

				<Tabs.Panel value="childrenMedInfo" pt="xs">
					{activeChildren &&
						activeChildren
							.map((child) => (
								<UpdateChildMedicalInfo key={child.childId} child={child} />
							))
							?.slice(indexOfFirstCard, indexOfLastCard)}

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

export default MedicalInfo;
