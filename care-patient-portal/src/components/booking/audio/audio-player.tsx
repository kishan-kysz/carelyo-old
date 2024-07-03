import { ActionIcon, Group } from '@mantine/core';
import { useEffect, useState } from 'react';
import { BiTrash } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';

// export default function AudioPlayer({
// 	base64Data,
// 	onDeleteRecording,
// 	handleModify,
// }: {
// 	base64Data: string;
// 	onDeleteRecording: () => void;
// 	handleModify?: () => void;
// }) {
// 	const [audioSrc, setAudioSrc] = useState<string>('');
// 	const { t } = useTranslation(['default']);

// 	useEffect(() => {
// 		if (base64Data !== undefined) {
// 			// Decode the base64 data into a binary string
// 			const binaryString = window.atob(base64Data);
// 			let type = 'audio/webm; codecs=opus';

// 			// Check if the browser can play WebM Opus
// 			if (!MediaRecorder.isTypeSupported('audio/webm')) {
// 				// since Opus is not supported, switch to AAC
// 				type = 'audio/mp4; codecs=aac';
// 			}
// 			// Convert the binary string to a Blob
// 			const blob = new Blob(
// 				[
// 					new Uint8Array(binaryString.length).map((_, i) =>
// 						binaryString.charCodeAt(i)
// 					),
// 				],
// 				{
// 					type,
// 				}
// 			);

// 			// Create a Data URI for the Blob that includes the base64-encoded data
// 			const dataUri = URL.createObjectURL(blob);

// 			// Set the Data URI as the audio player's source
// 			setAudioSrc(dataUri);
// 			// Clean up the Data URI when the component unmounts
// 			return () => {
// 				URL.revokeObjectURL(dataUri);
// 			};
// 		}
// 	}, [base64Data]);

// 	return (
// 		<Group my="sm" w="100%" position="right">
// 			<audio
// 				controls={true}
// 				src={audioSrc}
// 				style={{
// 					borderRadius: '5px',
// 					flex: 1,
// 					maxWidth: '100%',
// 				}}
// 			/>
// 			<ActionIcon
// 				size="md"
// 				onClick={onDeleteRecording || handleModify}
// 				title={t('tr.delete')}
// 				color="orange"
// 			>
// 				<BiTrash size={32} />
// 			</ActionIcon>
// 		</Group>
// 	);
// }

export default function AudioPlayer({
	base64Data,
	onDeleteRecording,
	handleModify,
}: {
	base64Data: string;
	onDeleteRecording: () => void;
	handleModify?: () => void;
}) {
	const [audioSrc, setAudioSrc] = useState<string | null>(null); // Initial value is null
	const { t } = useTranslation(['default']);

	useEffect(() => {
		if (base64Data) {
			const binaryString = window.atob(base64Data);
			const bytes = new Uint8Array(binaryString.length);
			for (let i = 0; i < binaryString.length; i++) {
				bytes[i] = binaryString.charCodeAt(i);
			}
			const blob = new Blob([bytes], { type: 'audio/mpeg' });

			// Set blob as the audio source
			setAudioSrc(URL.createObjectURL(blob)); // Update audioSrc state
		} else {
			setAudioSrc(null); // Reset audioSrc when base64Data is null
		}
	}, [base64Data]);

	return (
		<Group my="sm" w="100%" position="right">
			{audioSrc && ( // Render audio element only when audioSrc is not null
				<audio
					controls
					style={{ borderRadius: '5px', flex: 1, maxWidth: '100%' }}
					src={audioSrc}
				/>
			)}
			<ActionIcon
				size="md"
				onClick={onDeleteRecording || handleModify}
				title={t('tr.delete')}
				color="orange"
			>
				<BiTrash size={32} />
			</ActionIcon>
		</Group>
	);
}