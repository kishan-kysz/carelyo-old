import { ActionIcon, Box, Flex, Stack, Text, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { Fragment, useEffect, useState } from 'react';
import { MdError } from 'react-icons/md';
import { useReactMediaRecorder } from 'react-media-recorder-2';
import { useTranslation } from 'react-i18next';
import { useBooking } from '../../hooks/use-booking';
import ComponentState, { ActiveComponents } from './audio/change-audio-state';
import CustomDropZone from '../support/custom-drop-zone';
import { transformImages } from '../../utils';
import AudioPlayer from './audio/audio-player';
import BookingControls from './booking-controls';
import Notes from './notes';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophoneLines } from '@fortawesome/free-solid-svg-icons';

export default function BookingDetails({
	previousStep,
	nextStep,
}: {
	nextStep: () => void;
	previousStep: () => void;
}) {
	const { t } = useTranslation(['default']);
	const { actions, booking } = useBooking();

	const [activeComponent, setActiveComponent] =
		useState<ActiveComponents>('Record');
	const getSupportedMimeTypes = () => {
		const mimeTypes = [
			'audio/webm',
			'audio/webm;codecs=opus',
			'audio/webm;codecs=pcm',
			'audio/ogg',
			'audio/mp4',
			'audio/mpeg',
		];
		return (
			mimeTypes.filter((mimeType) =>
				MediaRecorder.isTypeSupported(mimeType)
			)[0] || ''
		);
	};
	const {
		status,
		startRecording,
		stopRecording,
		mediaBlobUrl,
		error,
		clearBlobUrl,
	} = useReactMediaRecorder({
		audio: true,
		mediaRecorderOptions: { mimeType: getSupportedMimeTypes() },
		onStop: (blobUrl) => {
			fetch(blobUrl)
				.then((response) => response.blob())
				.then((blob) => {
					const reader = new FileReader();
					reader.readAsDataURL(blob);
					reader.onloadend = () => {
						const result = reader.result;
						if (typeof result === 'string') {
							const base64data = result.split(',')[1];
							actions.handleAddAudioRecording(base64data);
							showNotification({
								message: `${t('tr.recording-saved')}`,
								color: 'green',
								autoClose: 2500,
							});
						}
					};
				});
		},
	});

	const canGoNext =
		(booking?.audioDetailedDescription?.length ?? 0) > 0 ||
		(booking?.textDetailedDescription?.length ?? 0) > 0;

	const handleNext = () => {
		stopRecording();
		nextStep();
	};

	const handleDeleteRecording = () => {
		clearBlobUrl();
		actions.handleAddAudioRecording('');
		setActiveComponent('Record');
		showNotification({
			message: `${t('tr.recording-deleted')}`,
			color: 'red',
			autoClose: 2500,
		});
	};

	useEffect(() => {
		if (mediaBlobUrl) {
			setActiveComponent('Listen');
		}
	}, [mediaBlobUrl]);

	return (
		<Stack
			sx={(theme) => ({
				backgroundColor: theme.colors.gray[1],
				padding: theme.spacing.sm,
				borderRadius: theme.spacing.xs,
				minHeight: 600,
			})}
		>
			<div style={{ marginBottom: '15px' }} />
			{error && (
				<span role="alert">
					<MdError />
					{error}
				</span>
			)}

			<ComponentState
				activeComponent={activeComponent}
				setActiveComponent={setActiveComponent}
			/>

			<Box>
				<Stack my="md">
					{activeComponent === 'Listen' ? (
						booking?.audioDetailedDescription?.length > 0 ? (
							<Fragment>
								<Title
									style={{
										fontFamily: mantineConfig.mantine.global.fontFamily,
									}}
									color={mantineConfig.mantine.title.color}
									weight={mantineConfig.mantine.title.fontWeight}
									size={mantineConfig.mantine.title.heading.fontSize}
									align="center"
									order={3}
								>
									{t('tr.playback')}
								</Title>
								<Text
									style={{
										fontFamily: mantineConfig.mantine.global.fontFamily,
									}}
									color={mantineConfig.mantine.text.color}
									weight={mantineConfig.mantine.text.fontWeight}
									align="center"
								>
									{t('tr.clear-audio')}
								</Text>
								<Flex
									justify="center"
									align="center"
									wrap="wrap"
									direction="row"
								>
									<AudioPlayer
										base64Data={booking?.audioDetailedDescription}
										onDeleteRecording={handleDeleteRecording}
									/>
								</Flex>
							</Fragment>
						) : (
							<Fragment>
								<Title
									style={{
										fontFamily: mantineConfig.mantine.global.fontFamily,
									}}
									color={mantineConfig.mantine.title.color}
									weight={mantineConfig.mantine.title.fontWeight}
									size={mantineConfig.mantine.title.heading.fontSize}
									align="center"
									order={3}
								>
									{t('tr.record-a-voice')}
								</Title>
								<Text
									style={{
										fontFamily: mantineConfig.mantine.global.fontFamily,
									}}
									color={mantineConfig.mantine.text.color}
									weight={mantineConfig.mantine.text.fontWeight}
									size={mantineConfig.mantine.text.fontSize}
									align="center"
								>
									{t('tr.no-recording')}
								</Text>
							</Fragment>
						)
					) : undefined}
					{activeComponent === 'Record' ? (
						<Stack align="center" p="lg">
							<Title
								style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
								color={mantineConfig.mantine.title.color}
								weight={mantineConfig.mantine.title.fontWeight}
								size={mantineConfig.mantine.title.heading.fontSize}
								align="center"
								order={3}
							>
								{t('tr.record-a-voice')}
							</Title>
							<Text
								style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
								color={mantineConfig.mantine.text.color}
								size={mantineConfig.mantine.text.fontSize}
								weight={mantineConfig.mantine.text.fontWeight}
								align="center"
							>
								{t('tr.clear-audio')}
							</Text>
							{status === 'recording' ? (
								<ActionIcon
									size={120}
									variant="filled"
									radius={'xl'}
									color="red"
									mb="md"
									onClick={stopRecording}
								>
									<div style={{ textAlign: 'center' }}>
										<FontAwesomeIcon icon={faMicrophoneLines} spin size="3x" />
										<Text
											style={{
												fontFamily: mantineConfig.mantine.global.fontFamily,
												color: mantineConfig.mantine.button.color,
												textAlign: 'center',
											}}
										>
											<Text ta="center">{t('tr.stop-recording')}</Text>
										</Text>
									</div>
									{/* <Text ta="center">{t('tr.stop-recording')}</Text> */}
								</ActionIcon>
							) : (
								<ActionIcon
									size={120}
									variant="filled"
									radius={'xl'}
									color={mantineConfig.mantine.button.color}
									mb="md"
									onClick={startRecording}
								>
									<div style={{ textAlign: 'center' }}>
										<FontAwesomeIcon
											icon={faMicrophoneLines}
											beatFade
											size="3x"
										/>
										<Text
											style={{
												fontFamily: mantineConfig.mantine.global.fontFamily,
												color: mantineConfig.mantine.button.color,
												textAlign: 'center',
											}}
										>
											{t('tr.start-recording')}
										</Text>
									</div>
									{/* <Text  style={{ fontFamily: mantineConfig.mantine.global.fontFamily}} color={mantineConfig.mantine.button.color} ta="center">{t('tr.start-recording')}</Text> */}
								</ActionIcon>
							)}
						</Stack>
					) : undefined}
					{activeComponent === 'Notes' ? <BoookingNotes /> : undefined}
				</Stack>
				<BookingControls
					previous={previousStep}
					next={handleNext}
					showNext={canGoNext}
				/>
			</Box>
		</Stack>
	);
}

const BoookingNotes = () => {
	const { actions } = useBooking();
	const handleDrop = async (acceptedFiles: File[]) => {
		const base64 = await transformImages(acceptedFiles);
		actions.handleAddImages(base64);
	};
	return (
		<Stack>
			<Notes />
			<CustomDropZone maxAmount={2} setFieldValue={handleDrop} />
		</Stack>
	);
};
