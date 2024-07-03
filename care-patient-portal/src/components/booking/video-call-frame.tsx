import DailyIframe, { DailyCall, DailyMeetingState } from '@daily-co/daily-js';
import { showNotification } from '@mantine/notifications';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useGuardedNavigation } from '../../pages/navigation';
import { Box, Button, Group, Paper, Stack, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { routes } from '../../api/routes';
import useProfile from '../../hooks/use-profile';
import { useTranslation } from 'react-i18next';

const VideoCallFrame = () => {
	const { navigate } = useGuardedNavigation();
	const { user } = useProfile();
	const hasActiveConsultation =
		user?.activeConsultation !== null && !!user?.activeConsultation?.id;
	const activeConsultation = user?.activeConsultation
		? user?.activeConsultation
		: null;
	const [callFrame, setCallFrame] = useState<DailyCall>();
	const [callState, setCallState] = useState<DailyMeetingState>('loading');
	const videoRef = useRef<HTMLDivElement>(null);
	const { t } = useTranslation(['default']);

	useLayoutEffect(() => {
		if (!activeConsultation) {
			navigate('waitingroom');
		}
	}, [activeConsultation]);
	const { data: token } = useQuery(
		[
			'videoToken',
			user?.activeConsultation?.id,
			activeConsultation?.transactionReference,
		],
		() => routes.getVideoToken(user?.activeConsultation?.id),
		{
			select: (data) => data?.token,
			enabled: hasActiveConsultation,
		}
	);

	const joinCall = () => window.location.reload();

	useEffect(() => {
		if (activeConsultation?.status === 'started' && token && !callFrame) {
			if (!videoRef.current) {
				return;
			}
			const currentCallFrame = DailyIframe.createFrame(videoRef.current);
			void currentCallFrame.join({
				showLeaveButton: true,
				showFullscreenButton: true,
				showLocalVideo: true,
				url: user?.activeConsultation?.consultationUrl,
				token: token,
				iframeStyle: {
					width: '100%',
					height: '100%',
				},
			});
			setCallFrame(currentCallFrame);
			currentCallFrame.on('loaded', () => {
				setCallState('loaded');
			});
			currentCallFrame.on('joined-meeting', () => {
				setCallState('joined-meeting');
			});
			currentCallFrame.on('left-meeting', () => {
				setCallState('left-meeting');
			});
			currentCallFrame.on('error', (error) => {
				if (error?.errorMsg === 'Meeting has ended') {
					showNotification({
						title: 'Finished Consultation',
						message: 'Meeting has ended',
					});
				}
				setCallState('left-meeting');
				void currentCallFrame.leave();
			});
			return () => {
				void currentCallFrame.destroy();
			};
		}
	}, [activeConsultation, videoRef.current, token, callFrame, callState]);

	switch (activeConsultation?.status) {
		case 'finished':
			return (
				<Stack>
					<Title align="center">
						{t('tr.this-meeting-has-ended-view-summary-or-book-or-new')}
					</Title>
					<Group position="center">
						<Button
							onClick={() =>
								navigate('consultation', [String(user?.activeConsultation?.id)])
							}
						>
							{t('tr.summary')}
						</Button>
						<Button onClick={() => navigate('booking')}>
							{t('tr.new-consultation')}
						</Button>
					</Group>
				</Stack>
			);
		case 'started': {
			if (callState === 'left-meeting') {
				return (
					<Stack mt={200} h="100%" justify="center" align="center">
						<Title align="center">{t('tr.you-have-left-an-ongoing-consultation')}</Title>
						<Group position="center">
							<Button onClick={joinCall}>{t('tr.join')}</Button>
						</Group>
					</Stack>
				);
			}
			return (
				<Paper>
					<Box ref={videoRef} sx={{ width: '100%', height: '80vh' }} />
				</Paper>
			);
		}
		default:
			return (
				<>
					<Stack>
						<Title align="center">{t('tr.something-unexpected-happened')}</Title>
						<Group position="center">
							<Button onClick={() => navigate('waitingroom')}>
								{' '}
								{t('tr.back-to-waiting-room')}
							</Button>
							<Button onClick={() => window.location.reload()}>
								{t('tr.refresh-page')}
							</Button>
						</Group>
					</Stack>
				</>
			);
	}
};

export default VideoCallFrame;

/*return callState !== 'left-meeting' || callFrame ? <Paper>
  <Box ref={videoRef} sx={{ width: '100%', height: '80vh' }} />
</Paper> : <Stack mt={200} h='100%' justify='center' align='center'>
  <Title align='center'>You have left an ongoing consultation</Title>
  <Group position='center'>
    <Button onClick={rejoin}>Join</Button>
  </Group>
</Stack>*/

/*
<Stack>
<Title align='center'>This meeting has not started yet</Title>
<Group position='center'>
  <Button onClick={() => navigate('waitingroom')}> Back to waiting room?</Button>
</Group>
</Stack> ;*/
