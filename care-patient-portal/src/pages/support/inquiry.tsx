import {
	Box,
	Button,
	createStyles,
	Group,
	Select,
	Text,
	Textarea,
	TextInput,
	Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import mantineConfig from '../../assets/styles/config/mantine.config.json';

import Container from '../../components/layout/container';
import { supportOptions } from '../../constants/support-options';
import CustomDropZone from '../../components/support/custom-drop-zone';
import { routes } from '../../api/routes';
import useProfile from '../../hooks/use-profile';
import { transformImages } from '../../utils';
import PageTitle from '../../components/core/page-title';

type FormData = {
	subject: string;
	message: string;
	images: {
		encodedContent: string;
		objectName: string;
	}[];
};

export const Support = () => {
	const { classes } = useStyles();
	const { user } = useProfile();
	const { t } = useTranslation(['default']);

	const [showInput, setShowInput] = useState<boolean>(false);
	const [subject, setSubject] = useState<string>('');
	const [other, setOther] = useState<string>('');
	const [message, setMessage] = useState<string>('');

	const { mutateAsync } = useMutation(routes.createInquiry);

	const MAX_LENGTH_SUBJECT = 50;
	const MAX_LENGTH_MESSAGE = 500;
	const MAX_AMOUNT_IMAGES = 3;

	const form = useForm<FormData>({
		initialValues: {
			subject: '',
			message: '',
			images: [],
		},
	});

	const onSelectChange = (value: string) => {
		setShowInput(value === 'other');
		setSubject(value);
		form.setFieldValue('subject', t(`tr.${value}`));
	};

	const updateImages = async (value: File[]) => {
		const base64files = await transformImages(value);
		form.setFieldValue('images', base64files);
	};

	const submitSupport = async (values: FormData) => {
		await mutateAsync(values, {
			onSuccess: () => {
				form.reset();
				setShowInput(false);
				setSubject('');
				setOther('');
				setMessage('');
				showNotification({
					title: t('tr.your-title'),
					message: t('tr.message'),
					autoClose: 2500,
				});
			},
			onError: () => {
				showNotification({
					title: t('tr.notification_error-title'),
					message: t('tr.notification_error-message'),
					autoClose: 2500,
				});
			},
		});
	};
	const selectData = supportOptions.map((option: string) => ({
		value: option,
		label: t(`tr.${option}`),
	}));
	return (
		<Container>
			<PageTitle heading={`${t('tr.support-title')}`} />
			<Box sx={{ maxWidth: 500, marginBottom: '3rem' }}>
				<Box className={classes.greeting}>
					<Title
						mb="xs"
						color={mantineConfig.mantine.title.color}
						size={mantineConfig.mantine.title.heading.subheading.fontSize}
						weight={mantineConfig.mantine.title.heading.subheading.fontWeight}
					>
						{' '}
						{t('tr.hi')} {user?.firstName}, {t('tr.help1')}😍
					</Title>

					<Text
						fz="md"
						color={mantineConfig.mantine.text.color}
						size={mantineConfig.mantine.text.fontSize}
						weight={mantineConfig.mantine.text.fontWeight}
					>
						{t('tr.explain')}
					</Text>
				</Box>

				<form onSubmit={form.onSubmit(submitSupport)}>
					<Title
						mb="xs"
						mt="xs"
						color={mantineConfig.mantine.input.label.color}
						size={mantineConfig.mantine.input.label.fontSize}
						weight={mantineConfig.mantine.input.label.fontWeight}
					>
						{t('tr.subject')}
					</Title>
					<Select
						size={mantineConfig.mantine.input.size}
						/* 						label={t('tr.subject')} */
						placeholder={`${t('tr.s-placeholder')}`}
						required={true}
						value={subject}
						onChange={onSelectChange}
						data={selectData}
					/>

					{showInput && (
						<Box sx={{ position: 'relative' }}>
							<TextInput
								label={t('tr.Options.other')}
								placeholder={`${t('tr.Options.other')}`}
								mt="md"
								name="subject"
								variant="filled"
								required={true}
								value={other}
								onChange={(e) => {
									if (e.target.value.length > MAX_LENGTH_SUBJECT) {
										return;
									}
									setOther(e.target.value);
									form.setFieldValue('subject', e.target.value);
								}}
							/>
							<Text className={classes.maxLengthText}>
								{other.length} / {MAX_LENGTH_SUBJECT}
							</Text>
						</Box>
					)}

					<Box sx={{ position: 'relative' }}>
						<Title
							mb="xs"
							mt="xs"
							color={mantineConfig.mantine.input.label.color}
							size={mantineConfig.mantine.input.label.fontSize}
							weight={mantineConfig.mantine.input.label.fontWeight}
						>
							{t('tr.message')}
						</Title>
						<Textarea
							mt="md"
							placeholder={`${t('tr.m-placeholder')}`}
							maxRows={10}
							minRows={5}
							autosize={true}
							name="message"
							variant="filled"
							required={true}
							value={message}
							onChange={(e) => {
								if (e.target.value.length > MAX_LENGTH_MESSAGE) {
									return;
								}
								setMessage(e.target.value);
								form.setFieldValue('message', e.target.value);
							}}
						/>
						<Text className={classes.maxLengthText}>
							{message.length} / {MAX_LENGTH_MESSAGE}
						</Text>
					</Box>
					<Title
						mb="xs"
						mt="xs"
						color={mantineConfig.mantine.input.label.color}
						size={mantineConfig.mantine.input.label.fontSize}
						weight={mantineConfig.mantine.input.label.fontWeight}
					>
						{t('tr.attachment')}
					</Title>
					<CustomDropZone
						maxAmount={MAX_AMOUNT_IMAGES}
						setFieldValue={updateImages}
					/>

					<Group position="center" mt="xl">
						<Button type="submit" size="md">
							{t('tr.send-message')}
						</Button>
					</Group>
				</form>
			</Box>
		</Container>
	);
};

const useStyles = createStyles(({ colors }) => ({
	greeting: {
		background: '#f1f1f1',
		padding: '1rem',
		borderRadius: '.5rem',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	maxLengthText: {
		position: 'absolute',
		top: 4,
		right: 0,
		fontSize: '.8rem',
		color: colors.gray[6],
	},
}));
