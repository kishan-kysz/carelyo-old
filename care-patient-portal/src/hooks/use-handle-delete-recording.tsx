import { showNotification } from '@mantine/notifications';
import { ActiveComponents } from '../components/booking/audio/change-audio-state';

export type THandleDeleteRecordingProps = {
	clearBlobUrl: () => void;
	actions: {
		handleAddAudioRecording: (audio: string) => void;
	};
	setActiveComponent: (component: ActiveComponents) => void | 'Record';
	t: (key: string) => string;
	previousStep: () => void;
};

export const handleDeleteRecording = ({
	clearBlobUrl,
	actions,
	setActiveComponent,
	t,
	previousStep,
}: THandleDeleteRecordingProps) => {
	clearBlobUrl();
	actions.handleAddAudioRecording('');
	setActiveComponent('Record');
	showNotification({
		message: `${t('tr.recording-deleted')}`,
		color: 'red',
		autoClose: 2500,
	});

	if (previousStep) {
		previousStep();
	}
};
