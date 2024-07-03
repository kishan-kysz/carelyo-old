import { useEffect, useState } from 'react';

const initialState = {
	recordingMinutes: 0,
	recordingSeconds: 0,
	recordingTime: 30,
	initRecording: false,
	mediaStream: null,
	mediaRecorder: null,
	audio: null,
	audioData: null,
	noPermission: false,
	isSupported: true,
};

/**
 * If the browser supports MediaRecorder and the browser supports either webm or mp4, then return true
 * @returns A boolean value.
 */
function isSupportsRecording() {
	if (!MediaRecorder) {
		return false;
	}

	if (!MediaRecorder.isTypeSupported) {
		return false;
	}

	return !!(
		MediaRecorder.isTypeSupported('audio/webm') ||
		MediaRecorder.isTypeSupported('audio/mp4')
	);
}

/**
 * It asks the user for permission to use the microphone, and if the user grants permission, it starts
 * recording.
 *
 * The function is asynchronous, so it returns a promise. If the promise is fulfilled, the user has
 * granted permission to use the microphone. If the promise is rejected, the user has denied
 * permission.
 *
 * The function uses the getUserMedia() method to ask the user for permission to use the microphone. If
 * the user grants permission, the method returns a MediaStream object.
 *
 * The function then checks if the browser supports recording. If it doesn't, it stops the microphone
 * and sets the isSupported property to false.
 *
 * If the browser supports recording, the function sets the initRecording property to true. This will
 * trigger the recording to start.
 *
 * If the user denies permission to use the microphone, the function sets the noPermission property to
 * true. This will trigger the "No
 * @param setRecorderState - This is a function that updates the state of the recorder.
 * @returns The return value is a promise that resolves to a MediaStream object.
 */
async function startRecording(setRecorderState) {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

		// Do not start recording if media type is not supported by browser
		if (!isSupportsRecording()) {
			stream.getAudioTracks().forEach((track) => track.stop());

			return setRecorderState((prevState) => {
				return {
					...prevState,
					isSupported: false,
				};
			});
		}

		setRecorderState((prevState) => {
			return {
				...prevState,
				initRecording: true,
				mediaStream: stream,
				noPermission: false,
			};
		});
	} catch (error) {
		setRecorderState((prevState) => {
			return {
				...prevState,
				noPermission: true,
			};
		});
		// console.error(error);
	}
}

/**
 * The function takes a recorder object as an argument and if the recorder is not inactive, it stops
 * the recorder.
 * @param recorder - The recorder object.
 */
function saveRecording(recorder) {
	if (recorder.state !== 'inactive') {
		recorder.stop();
	}
}

/**
 * It takes in an audio blob and a function that sets the state of the recorder component. It then sets
 * the state of the recorder component to the audio blob and the URL of the audio blob
 * @param audioData - The audio data that will be used to create the audio URL.
 * @param setRecorderState - This is a function that will update the state of the recorder.
 */
function setAudioData(audioData, setRecorderState) {
	setRecorderState((prevState) => {
		return {
			...prevState,
			audioData,
			audio: window.URL.createObjectURL(audioData),
		};
	});
}

function formatSeconds(time) {
	return time % 60;
}

function formatMinutes(time) {
	return Math.floor(time / 60);
}

/**
 * It's a React hook that uses the MediaRecorder API to record audio and returns an object with
 * functions to start, stop, save, and delete the recording
 * @param [recordingTime=30] - The time in seconds that the user will be able to record for.
 * @returns The useRecorder function is being returned.
 */
export default function useRecorder(recordingTime = 30) {
	const updatedInitialState = {
		...initialState,
		recordingSeconds: formatSeconds(recordingTime),
		recordingMinutes: formatMinutes(recordingTime),
		recordingTime,
	};
	const [recorderState, setRecorderState] = useState(updatedInitialState);

	useEffect(() => {
		let recordingInterval = null;

		if (recorderState.initRecording) {
			recordingInterval = setInterval(() => {
				setRecorderState((prevState) => {
					// Audio recording stops when time reaches zero
					if (prevState.recordingTime === 0) {
						clearInterval(recordingInterval);
						saveRecording(recorderState.mediaRecorder);
						return prevState;
					} else {
						return {
							...prevState,
							recordingSeconds: formatSeconds(prevState.recordingTime - 1),
							recordingMinutes: formatMinutes(prevState.recordingTime - 1),
							recordingTime: prevState.recordingTime - 1,
						};
					}
				});
			}, 1000);
		} else {
			clearInterval(recordingInterval);
		}

		return () => clearInterval(recordingInterval);
	});

	/**
	 * Create a MediaRecorder if we have a MediaStream. If we don't have permission,
	 * user do not take action or not in secure context, MediaStream will be undefined.
	 */
	useEffect(() => {
		if (recorderState.mediaStream) {
			setRecorderState((prevState) => {
				let mimeType = 'audio/webm';

				if (!MediaRecorder.isTypeSupported('audio/webm')) {
					mimeType = 'audio/mp4';
				}

				return {
					...prevState,
					mediaRecorder: new MediaRecorder(prevState.mediaStream, {
						mimeType: mimeType,
						audioBitsPerSecond: 64000,
					}),
				};
			});
		}
	}, [recorderState.mediaStream]);

	useEffect(() => {
		const recorder = recorderState.mediaRecorder;
		let chunks = [];

		if (recorder && recorder.state === 'inactive') {
			recorder.start();

			recorder.ondataavailable = (e) => {
				chunks.push(e.data);
			};

			recorder.onstop = () => {
				let type = 'audio/webm; codecs=opus';

				if (!MediaRecorder.isTypeSupported('audio/webm')) {
					type = 'audio/mp4; codecs=aac';
				}

				const blob = new Blob(chunks, { type: type });
				chunks = [];

				setRecorderState((prevState) => {
					if (prevState.mediaRecorder) {
						return {
							...updatedInitialState,
							audio: window.URL.createObjectURL(blob),
							audioData: blob,
						};
					} else {
						return updatedInitialState;
					}
				});
			};
		}

		return () => {
			if (recorder) {
				recorder.stream.getAudioTracks().forEach((track) => track.stop());
			}
		};
	}, [recorderState.mediaRecorder]);

	return {
		recorderState,
		startRecording: () => startRecording(setRecorderState),
		deleteRecording: () => setRecorderState(updatedInitialState),
		saveRecording: () => saveRecording(recorderState.mediaRecorder),
		setInitialAudioData: (audioData) =>
			setAudioData(audioData, setRecorderState),
	};
}
