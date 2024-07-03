import {
	Button,
	FileInput,
	Group,
	Select,
	Space,
	TextInput,
	Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import useProfile from '../../hooks/use-profile';
import { TITLE_DATA } from '../../constants';
import dayjs from 'dayjs';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
import { IconFileDownload, IconFileUpload } from '@tabler/icons-react';
import { Fragment, useState } from 'react';
import { showNotification } from '@mantine/notifications';

const AccountDetails = () => {
	const { t } = useTranslation(['default']);
	const { user, updateProfile } = useProfile();

	const form = useForm({
		initialValues: {
			title: user?.title ? user.title : '',
			firstName: user?.firstName ? user.firstName.toUpperCase() : '',
			surName: user?.surName ? user.surName.toUpperCase() : '',
			email: user?.email ? user.email.toUpperCase() : '',
			maritalStatus: user?.maritalStatus ? user.maritalStatus : '',
			mobile: user?.mobile ? user.mobile : '',
			gender: user?.polygenic?.gender,
			dateOfBirth: user?.dateOfBirth
				? dayjs(user.dateOfBirth).format('YYYY/MM/DD')
				: '',
			nationalIdNumber: user?.nationalIdNumber ? user.nationalIdNumber : null,
			ninCard: user?.ninCard ? user.ninCard : null,
			ninCardFileName: user?.ninCardFileName ? user.ninCardFileName : '',
		},
		validate: {
			firstName: (value) =>
				value.length < 2
					? t('tr.firstname-must-have-at-least-2-letters')
					: null,
			surName: (value) =>
				value.length < 2 ? t('tr.surname-must-have-at-least-2-letters') : null,
			email: (value) =>
				/^\S+@\S+$/.test(value) ? null : t('tr.invalid-email'),
			mobile: (value) =>
				value.length < 10 ? t('tr.mobile-number-must-have-10-letters') : null,
			nationalIdNumber: (value) =>
				String(value).length !== 11
					? t('tr.NIN-number-must-be-of-11-digit')
					: null,
		},
	});

	const [selectedFileName, setSelectedFileName] = useState('');
	const [selectedFile, setSelectedFile] = useState(null);

	// const handleFileUpload = (file: any) => {
	// 	if (file) {
	// 		form.setDirty({ dirty: true });
	// 		setSelectedFile(file);
	// 		setSelectedFileName(file.name);
	// 	} else {
	// 		form.setDirty({ dirty: false });
	// 	}
	// };
	const handleFileUpload = (file: any) => {
		if (file) {
			const maxSize = 1048576; // 1 MB in bytes
			if (file.size > maxSize) {
				showNotification({
					title: "File size exceeds 1 MB limit.",
					color: 'red',
					message: '',
				})
				return; 
			}
			form.setDirty({ dirty: true });
			setSelectedFile(file);
			setSelectedFileName(file.name);
		} else {
			// Handle case where no file is selected
			form.setDirty({ dirty: false });
		}
	};

	const handleDownload = (base64Data: any, fileName: any) => {
		const byteCharacters = atob(base64Data.value);
		const byteNumbers = new Array(byteCharacters.length);
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		const byteArray = new Uint8Array(byteNumbers);
		const blob = new Blob([byteArray], { type: 'application/octet-stream' });

		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = fileName.value;

		document.body.appendChild(link);
		link.click();

		document.body.removeChild(link);
	};

	return (
		<form
			onSubmit={form.onSubmit(async (values) => {
				values.ninCard = selectedFile;
				values.ninCardFileName = selectedFileName;
				await updateProfile({ id: user?.userId, ...values });
				form.resetDirty();
			})}
		>
			<Title
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
			>
				{t('tr.your-title').toUpperCase()}
			</Title>
			<Select
				size={mantineConfig.mantine.input.size}
				nothingFound="No options"
				my={'sm'}
				disabled={true}
				defaultValue={user?.title}
				placeholder={`${t('tr.pick-one')}`}
				data={TITLE_DATA.map((option) => ({
					value: option.label,
					label: t(`${option.value}`),
				}))}
				{...form.getInputProps('title')}
			/>
			<Title
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
				mb="xs"
			>
				{t('tr.first-name').toUpperCase()}
			</Title>
			<TextInput
				size={mantineConfig.mantine.input.size}
				mb={'sm'}
				disabled={true}
				placeholder={`${t('tr.first-name').toUpperCase()}`}
				{...form.getInputProps('firstName')}
			/>
			<Title
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
				mb="xs"
			>
				{t('tr.last-name').toUpperCase()}{' '}
			</Title>
			<TextInput
				size={mantineConfig.mantine.input.size}
				mb={'sm'}
				disabled={true}
				placeholder={`${t('tr.last-name').toUpperCase()}`}
				{...form.getInputProps('surName')}
			/>
			<Title
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
				mb="xs"
			>
				{t('tr.email').toUpperCase()}
			</Title>
			<TextInput
				size={mantineConfig.mantine.input.size}
				mb={'sm'}
				disabled={true}
				placeholder="your@email.com"
				{...form.getInputProps('email')}
			/>
			<Title
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
				mb="xs"
			>
				{t('tr.phone').toUpperCase()}{' '}
			</Title>
			<TextInput
				size={mantineConfig.mantine.input.size}
				mb={'sm'}
				disabled={true}
				type="text"
				placeholder="0123456789"
				{...form.getInputProps('mobile')}
			/>
			{user?.nationalIdNumber != null ? (
				<>
					<Title
						mb={'sm'}
						color={mantineConfig.mantine.input.label.color}
						size={mantineConfig.mantine.input.label.fontSize}
						weight={mantineConfig.mantine.input.label.fontWeight}
					>
						{t('tr.national-identification-number').toUpperCase()}{' '}
					</Title>
					<TextInput
						type="number"
						mb={'sm'}
						disabled={true}
						maxLength={11}
						size={mantineConfig.mantine.input.size}
						withAsterisk={true}
						placeholder={`${t('tr.national-identification-number')}`}
						required={true}
						{...form.getInputProps('nationalIdNumber')}
					/>
				</>
			) : (
				<>
					<Title
						mb={'sm'}
						color={mantineConfig.mantine.input.label.color}
						size={mantineConfig.mantine.input.label.fontSize}
						weight={mantineConfig.mantine.input.label.fontWeight}
					>
						{t('tr.national-identification-number').toUpperCase()}{' '}
					</Title>
					<TextInput
						type="number"
						mb={'sm'}
						maxLength={11}
						size={mantineConfig.mantine.input.size}
						withAsterisk={true}
						placeholder={`${t('tr.national-identification-number')}`}
						required={true}
						{...form.getInputProps('nationalIdNumber')}
					/>
				</>
			)}
			{form.getInputProps('ninCard').value != null ? (
				<Fragment>
					<Title
						mb={'sm'}
						color={mantineConfig.mantine.input.label.color}
						size={mantineConfig.mantine.input.label.fontSize}
						weight={mantineConfig.mantine.input.label.fontWeight}
					>
						{t('tr.download-nin-card').toUpperCase()}{' '}
					</Title>
					<TextInput
						type="text"
						readOnly
						mb={'sm'}
						size={mantineConfig.mantine.input.size}
						withAsterisk={true}
						icon={<IconFileDownload size="1.5rem" />}
						onClick={() => {
							handleDownload(
								{ ...form.getInputProps('ninCard') },
								{ ...form.getInputProps('ninCardFileName') }
							);
						}}
						{...form.getInputProps('ninCardFileName')}
					/>
				</Fragment>
			) : (
				<Fragment>
					<Title
						mb={'sm'}
						color={mantineConfig.mantine.input.label.color}
						size={mantineConfig.mantine.input.label.fontSize}
						weight={mantineConfig.mantine.input.label.fontWeight}
					>
						{t('tr.upload-nin-card').toUpperCase()}{' '}
					</Title>
					<FileInput
						clearable={true}
						withAsterisk={true}
						mb={'sm'}
						size={mantineConfig.mantine.input.size}
						icon={<IconFileUpload size="1.5rem" />}
						placeholder={t('tr.upload-nin-card')}
                        onChange={handleFileUpload}
					/>
				</Fragment>
			)}
			<Title
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
				mb="xs"
			>
				{t('tr.marital-status').toUpperCase()}
			</Title>
			<Select
				size={mantineConfig.mantine.input.size}
				nothingFound="No options"
				placeholder={`${t('tr.pick-one').toUpperCase()}`}
				data={[
					{ value: 'Married', label: `${t('tr.married').toUpperCase()}` },
					{ value: 'Single', label: `${t('tr.single').toUpperCase()}` },
					{ value: 'Divorced', label: `${t('tr.divorced').toUpperCase()}` },
					{ value: 'Engaged', label: `${t('tr.engaged').toUpperCase()}` },
				]}
				{...form.getInputProps('maritalStatus')}
			/>
			<Space h="xs" />
			<Title
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
				mb="xs"
			>
				{t('tr.date-of-birth').toUpperCase()}
			</Title>
			<TextInput
				size={mantineConfig.mantine.input.size}
				disabled={true}
				mb={'sm'}
				placeholder={'DD-MM-YY'}
				{...form.getInputProps('dateOfBirth')}
			/>
			<Group grow={true} position="right" mt="md">
				<Button disabled={!form.isDirty()} type="submit">
					{t('tr.save').toUpperCase()}
				</Button>
			</Group>
		</form>
	);
};

export default AccountDetails;
