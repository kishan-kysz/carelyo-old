import { Box, Button, Group, Modal, Rating, Stack, Text } from '@mantine/core';
import { useCallback, useMemo, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { routes } from '../../api/routes';
import { notifications } from '@mantine/notifications';
import useProfile from '../../hooks/use-profile';
import { useTranslation } from 'react-i18next';

const Feedback = ({
										submit,
									}: {
	submit: (value: number) => void;
}) => {
	const [value, setValue] = useState(0);
	const { t } = useTranslation(['default']);
	return (
		<Box>
			<Stack>
				<Text fw={600} align='center'>
					{t('tr.thank-you-for-using-our-service')}
					<Text color='green' fw={500}>
						{t('tr.we-would-love-to-hear-your-feedback')}
					</Text>
				</Text>
				<Group position='center'>
					<Stack>
						<Text>{t('tr.how-was-your-experience')}</Text>
						<Group position='center'>

							<Rating value={value} onChange={setValue} size='lg' />
						</Group>
						<Button onClick={() => submit(value)}>{t('tr.submit')}</Button>
					</Stack>
				</Group>
			</Stack>
		</Box>
	);
};

export const useFeedback = () => {
	const [feedbackModalOpened, { toggle, open, close }] = useDisclosure(false);
	const [consultationId, setConsultationId] = useState<number | null>(null);
	const queryClient = useQueryClient();
	const { user } = useProfile();
	const openFeedbackModal = useCallback((id: number) => {
		setConsultationId(id);
		open();
	}, [open]);
	const { mutateAsync } = useMutation(routes.createFeedback, {
		onSuccess: () => {
			close();
			void queryClient.setQueryData(['getProfile'], {
				...user,
				unratedConsultation: user?.unratedConsultation.filter((item) => item.id !== consultationId),
			});
			notifications.show({
					id: 'feedback-submitted',
					title: 'Feedback submitted', message: 'Thank you for your feedback', color: 'green',
				},
			);
		},
		onError: () => {
			close();

			notifications.show({
					id: 'feedback-error',
					title: 'Submission Error', message: 'Something went wrong, please try again later', color: 'red',
				},
			);
		},
	});
	const FeedbackModal = useCallback(() => {
		return (
			<Modal
				opened={feedbackModalOpened}
				onClose={close}
				title='Tell us about your experience'
			>
				<Feedback submit={(value) => {
					if (consultationId) {
						mutateAsync({ consultationId, rating: value }).then(() => {
							close();
						});
					}
				}} />
			</Modal>
		);
	}, [feedbackModalOpened, close]);

	return useMemo(
		() => ({ FeedbackModal, toggle, open: openFeedbackModal, close }),
		[FeedbackModal, toggle, open, close],
	);
};
