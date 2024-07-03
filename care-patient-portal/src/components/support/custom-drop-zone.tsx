import {
	ActionIcon,
	Box,
	createStyles,
	Flex,
	Group,
	Image,
	Text,
	useMantineTheme,
	Title
} from '@mantine/core';
import { Dropzone, DropzoneProps, MIME_TYPES } from '@mantine/dropzone';
import { useMediaQuery } from '@mantine/hooks';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { showNotification } from '@mantine/notifications';
import { BiTrash } from 'react-icons/bi';
import { Fragment, useState } from 'react';
import { type FileRejection } from 'react-dropzone';
import mantineConfig from '../../assets/styles/config/mantine.config.json';

type CustomDropZoneProps = {
	maxAmount: number;
	setFieldValue: (value: File[]) => void;
} & Omit<DropzoneProps, 'children' | 'onDrop'>;
const CustomDropZone = ({
	setFieldValue,
	maxAmount,
	...restProps
}: CustomDropZoneProps) => {
	const { classes } = useStyles();
	const theme = useMantineTheme();
	const isLarge = useMediaQuery(`(min-width: ${theme.breakpoints.xs}px)`);
	const { t } = useTranslation(['default']);
	const [images, setImages] = useState<File[]>([]);
	const [showDropzone, setShowDropzone] = useState(true);
	const ACCEPTED_MIME_TYPES = [
		MIME_TYPES.jpeg,
		MIME_TYPES.png,
		MIME_TYPES.webp,
	];
	const ACCEPTED_MIME_TYPES_ARRAY = ACCEPTED_MIME_TYPES.map(
		(type) => ` .${type.split('/')[1]}`
	);
	const ACCEPTED_MIME_TYPES_STRING = `${ACCEPTED_MIME_TYPES_ARRAY.slice(
		0,
		-2
	)}, ${ACCEPTED_MIME_TYPES_ARRAY.slice(
		ACCEPTED_MIME_TYPES_ARRAY.length - 2,
		-1
	)} ${t('or')} ${ACCEPTED_MIME_TYPES_ARRAY[ACCEPTED_MIME_TYPES.length - 1]}`;

	const onDrop = async (files: File[]) => {
		const amount = files.length;
		if (images.length + files.length > maxAmount || amount > maxAmount) {
			showNotification({
				title: t('tr.notification_ondrop_failure-title'),
				message: t('tr.notification_ondrop_failure-message', { maxAmount }),
				autoClose: 2500,
				color: 'red',
			});
			return;
		}
		const newFiles = [...images, ...files];
		setFieldValue(newFiles);
		setImages((prevState) => [...prevState, ...files]);
		showNotification({
			title: t('tr.notification_ondrop_success-title'),
			message:
				amount > 1
					? t('tr.notification_ondrop_success-message_many', { amount })
					: t('tr.notification_ondrop_success-message_one'),
			autoClose: 2500,
		});
		setShowDropzone(newFiles.length < maxAmount);
	};

	const onReject = (files: FileRejection[]) => {
		showNotification({
			title:
				files.length > 1
					? t('tr.notification_rejected-title_many', { amount: files.length })
					: t('tr.notification_rejected-title_one'),
			message: t('tr.notification_rejec-ed-message', {
				maxAmount,
				accepted: ACCEPTED_MIME_TYPES_STRING,
			}),
			autoClose: 2500,
			color: 'red',
		});
	};

	const deleteImage = async (file: File) => {
		const newFiles = [...images];
		newFiles.splice(newFiles.indexOf(file), 1);
		setImages(newFiles);
		setFieldValue(newFiles);
		showNotification({
			title: t('tr.notification_deleted-title'),
			message: t('tr.notification_deleted-message', { file: file.name }),
			autoClose: 2500,
		});
		setShowDropzone(true);
	};

	return (
		<Fragment>
			{showDropzone && (
				<Dropzone
					{...restProps}
					name="images"
					mt="md"
					onReject={onReject}
					maxSize={5 * 1000 * 1000}
					maxFiles={maxAmount}
					accept={ACCEPTED_MIME_TYPES}
					onDrop={onDrop}
				>
					<Group
						position="center"
						spacing="xl"
						style={{ minHeight: 80, pointerEvents: 'none' }}
					>
						<Dropzone.Accept>
							<IconUpload
								size={50}
								stroke={1.5}
								color={
									theme.colors[theme.primaryColor][
										theme.colorScheme === 'dark' ? 4 : 6
									]
								}
							/>
						</Dropzone.Accept>
						<Dropzone.Reject>
							<IconX
								size={50}
								stroke={1.5}
								color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
							/>
						</Dropzone.Reject>
						<Dropzone.Idle>
							<IconPhoto size={50} stroke={1.5} />
						</Dropzone.Idle>

						<div>
							<Text color={mantineConfig.mantine.text.color}
    size={mantineConfig.mantine.text.fontSize}
    weight={mantineConfig.mantine.text.fontWeight}>{t('tr.dropzone-title')}</Text>
							<Text   mt={7}>
								{t('tr.dropzone-description', { maxAmount })}
							</Text>
							{/* <Text mt={7}>{t('tr.description-img', { maxAmount })}</Text> */}
						</div>
					</Group>
				</Dropzone>
			)}

			{images.length ? (
				<Flex
					direction="row"
					mt={images.length ? 'xl' : 0}
					gap={images.length ? 'xl' : 0}
					w={'100%'}
					justify="center"
					align={'center'}
				>
					{images.map((file, index) => {
						const imageUrl = URL.createObjectURL(file);
						return (
							<Box key={index} className={classes.previewContainer}>
								<Image
									src={imageUrl}
									imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
								/>
								<Box className={classes.deleteContainer}>
									<ActionIcon
										onClick={() => deleteImage(file)}
										color={'red'}
										variant="filled"
									>
										<BiTrash radius="xs" size={20} />
									</ActionIcon>
								</Box>
							</Box>
						);
					})}
				</Flex>
			) : undefined}
		</Fragment>
	);
};

export default CustomDropZone;

const useStyles = createStyles(() => ({
	previewContainer: {
		position: 'relative',
		width: 220,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		boxShadow: '0 0 2px 2px rgba(0,0,0,.1)',
	},
	deleteContainer: {
		position: 'absolute',
		bottom: '0',
		right: '0',
		cursor: 'pointer',
	},
}));
