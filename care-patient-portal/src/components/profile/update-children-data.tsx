import {
	Button,
	Divider,
	Group,
	Select,
	SimpleGrid,
	Text,
	TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import styles from '../../assets/styles/components/step.module.css';
import useMutation from '../../hooks/use-children';
import { useTranslation } from 'react-i18next';
import { IChildrenResponse } from '../../api/types';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import PhoneInputMantine from '../phoneInput/PhoneInput';
import { useEffect, useState } from 'react';
import axiosApi from '../../api';

const UpdateChildData = ({
	child,
	setUpdateModal,
	setOpened,
}: {
	child: IChildrenResponse;
	setUpdateModal: (value: boolean) => void;
	setOpened: (value: boolean) => void;
}) => {
	const { t } = useTranslation(['default']);
	const { updateChild } = useMutation();
	const [userData, setUserData] = useState<any>(null);
	const [email, setEmail] = useState('');
	const [test, setTest] = useState(true);
	const api = axiosApi();

	useEffect(() => {
		
		if (email !== '') {
			api
				.get(`/v1/users/getUserByEmail/${email}`)
				.then((response) => {
					const userDataRes = response.data;
					console.log('userData : ', userData);
					setUserData(userDataRes);
				})
				.catch((error) => {
					console.error('Error fetching user data:', error);
				});
		}
		if (test && child.partner != null) {
			form.values.partner.mobile = child.partnerPhoneNumber;
			form.values.partner.firstName = child.partnerFirstName;
			form.values.partner.lastName = child.partnerLastName;
			form.values.partner.nationalIdNumber = child.partnerNationalIdNumber;
			setTest(false);
		} else {
			form.values.partner = {
				mobile: '+234 ',
				firstName: '',
				lastName: '',
				nationalIdNumber: ''
			};
		}
		setUserData(null);
	}, [email]);

	const handleSetPhone = (phone: string) => {
		userData?.mobile != null
			? userData.mobile
			: (form.values.partner.mobile = phone);
	};
	const maskPhoneNumber = (phoneNumber: string) => {
		let phoneNumberArray = phoneNumber.split('');
		for (let i = 5; i <= 9; i++) {
			phoneNumberArray[i] = 'X';
		}
		const maskedPhoneNumber = phoneNumberArray.join('');
		
		return maskedPhoneNumber;
	};

	const maskDigit = (phoneNumber: string) => {
		let phoneNumberArray = phoneNumber.split('');
		for (let i = 3; i <= 6; i++) {
			phoneNumberArray[i] = 'X';
		}
		const maskedPhoneNumber = phoneNumberArray.join('');
		return maskedPhoneNumber;
	};
	const form = useForm({
		initialValues: {
			childId: child.childId,
			name: child.name,
			dateOfBirth: new Date(child.dateOfBirth),
			polygenic: {
				gender: child.polygenic.gender,
			},
			partner:
				child.partner !== null
					? {
							firstName:
								child.partner.firstName !== null
									? child.partner.firstName
									: null,
							lastName:
								child.partner.lastName !== null ? child.partner.lastName : null,
							email: child.partner.email !== null ? child.partner.email : null,
							mobile:
								child.partner.mobile !== null
									? maskPhoneNumber(child.partner.mobile)
									: null,
							nationalIdNumber:
								child.partner.nationalIdNumber !== null
									? maskDigit(child.partner.nationalIdNumber)
									: null,
						}
					: null,
		},
		validate: {
			name: (value) =>
				value.length < 2
					? t('tr.firstname-must-have-at-least-2-letters')
					: null,
			dateOfBirth: (value) =>
				value == null ? t('tr.please-select-a-date') : null,
		},
	});
	const onSubmit = async (data: any) => {
		if (userData != null) {
			form.values.partner.mobile = userData.mobile;
			form.values.partner.firstName = userData.firstName;
			form.values.partner.lastName = userData.surName;
			form.values.partner.nationalIdNumber = userData.nationalIdNumber;
			form.values.partner.email = userData.email;
		}
		updateChild(data);
		setOpened(false);
		setUpdateModal(false);
	};

	const handleBack = () => {
		setOpened(false);
		setUpdateModal(false);
	};

	const handleEmailChange = (email: string) => {
		form.values.partner.email = email;
		setEmail(email);
		setUserData(null);
	};

	return (
		<div style={{ margin: '0 auto' }}>
			<h1 style={{ margin: '1rem' }} className={styles.title}>
				{t('tr.update-childs-data')}
			</h1>
			<form onSubmit={form.onSubmit((values) => onSubmit(values))}>
				<SimpleGrid
					cols={2}
					spacing="lg"
					breakpoints={[
						{ minWidth: 600, cols: 2, spacing: 'lg' },
						{ maxWidth: 600, cols: 1, spacing: 'sm' },
					]}
				>
					<TextInput
						withAsterisk={true}
						mb={'sm'}
						label={t('tr.first-name')}
						{...form.getInputProps('name')}
					/>
					<Select
						nothingFound="No options"
						withAsterisk={true}
						mb={'sm'}
						label={t('tr.gender')}
						placeholder={t('tr.pick-one')}
						data={[
							{ value: 'Boy', label: t('tr.boy') },
							{ value: 'Girl', label: t('tr.girl') },
							{ value: 'Non-binary', label: t('tr.non-binary') },
						]}
						{...form?.getInputProps('polygenic.gender')}
					/>
					<DatePickerInput
						mb={'sm'}
						label={t('tr.date-of-birth')}
						clearable={true}
						placeholder={'YYYY-MM-DD'}
						required={true}
						icon={<IconCalendar size={16} />}
						{...form.getInputProps('dateOfBirth')}
					/>
				</SimpleGrid>
				{child.partner != null && (
					<>
						<Divider
							my="xs"
							size="sm"
							label={
								<>
									<Text fz={14} fw={500}>
										{t('tr.partner-details')}
									</Text>
								</>
							}
							labelPosition="center"
						/>
						<SimpleGrid
							cols={2}
							spacing="lg"
							breakpoints={[
								{ minWidth: 600, cols: 2, spacing: 'lg' },
								{ maxWidth: 600, cols: 1, spacing: 'sm' },
							]}
						>
							<TextInput
								withAsterisk={true}
								mb={'sm'}
								label={t('tr.email')}
								onChange={(e) => handleEmailChange(e.target.value)}
							/>

							<PhoneInputMantine
								disable={userData?.mobile != null}
								value={
									userData?.mobile != null
										? userData.mobile
										: form.values.partner.mobile
								}
								handleSetPhone={handleSetPhone}
							/>
							<TextInput
								withAsterisk={true}
								mb={'sm'}
								label={t('tr.first-name')}
								value={userData?.firstName || form.values.partner?.firstName}
								disabled={!!userData?.firstName}
								onChange={(e) =>
									form.setFieldValue('partner.firstName', e.target.value)
								}
							/>
							<TextInput
								withAsterisk={true}
								mb={'sm'}
								label={t('tr.last-name')}
								value={userData?.surName || form.values.partner?.lastName}
								disabled={!!userData?.surName}
								onChange={(e) =>
									form.setFieldValue('partner.lastName', e.target.value)
								}
							/>

							<TextInput
								withAsterisk={true}
								mb={'sm'}
								label={t('tr.national-identification-number')}
								value={
									userData?.nationalIdNumber
										? maskDigit(userData?.nationalIdNumber)
										: form.values.partner.nationalIdNumber
								}
								disabled={!!userData?.nationalIdNumber}
								onChange={(e) =>
									form.setFieldValue('partner.nationalIdNumber', e.target.value)
								}
							/>
						</SimpleGrid>
					</>
				)}
				<Group position="center" mt="xl">
					<Button variant="default" onClick={handleBack}>
						{t('tr.back')}
					</Button>
					<Button type="submit">{t('tr.save-changes')}</Button>
				</Group>
			</form>
		</div>
	);
};

export default UpdateChildData;
