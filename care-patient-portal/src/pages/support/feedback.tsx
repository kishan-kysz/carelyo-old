import { Box, Button, Group, Rating, Text, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';
import Styles from '../../assets/styles/pages/feedback.module.css';
import PageTitle from '../../components/core/page-title';
import Container from '../../components/layout/container';
import { useTranslation } from 'react-i18next';
import { useGuardedNavigation } from '../navigation';

export const Feedback = () => {
	const { navigate } = useGuardedNavigation();
	const { t } = useTranslation(['default']);
	const form = useForm({
		initialValues: {
			case_suggestion: '',
			case_rating: 0,
		},
		validate: {},
	});

	const submitSupport = (data: {
		case_suggestion: string;
		case_rating: number;
	}) => {
		console.log(data);
		form.reset();
		showNotification({
			title: t('tr.thank-you'),
			message: t('tr.your-feedback-has-been-sent!'),
			autoClose: 2500,
		});
		navigate('home');
	};

	return (
		<Container sx={{ flex: '1', justifyContent: 'flex-start' }}>
			<PageTitle heading={`${t('tr.feedback').toUpperCase()}`} />

			<Box className={Styles['feedback-container']}>
				<form onSubmit={form.onSubmit((data) => submitSupport(data))}>
					<Group mt="md" sx={{ flexDirection: 'column' }}>
						<Text size="lg">{t('tr.rate-your-experience')}</Text>
						<Rating size="lg" {...form.getInputProps('case_rating')} />
					</Group>
					<Text mt={35} size="lg">
						{t('tr.do-you-have-any-wishes?-what-can-we-do-better?')}
					</Text>
					<Textarea
						mt="md"
						placeholder={t('tr.enter-your-message') as string}
						maxRows={10}
						minRows={5}
						autosize={true}
						name="message"
						{...form.getInputProps('case_suggestion')}
					/>
					<Group position="center" mt="xl">
						<Button type="submit">{t('tr.send-feedback')}</Button>
					</Group>
				</form>
			</Box>
		</Container>
	);
};
