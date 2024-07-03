import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { IGetInquiryById } from '../../helper/utils/types';
import { Text, Image, Box, Modal, useMantineTheme } from '@mantine/core';
import { KeyboardEvent } from 'react';


const ImageModal = ({
	selectedImage,
	setSelectedImage,
	inquiry,
	images,
	isPrev,
	isNext,
	index,
	opened,
	close
}: {
	selectedImage: string;
	setSelectedImage: (image: string) => void;
	inquiry: IGetInquiryById;
	images: string[];
	isPrev: boolean;
	isNext: boolean;
	index: number;
	opened: boolean;
	close: () => void;
}) => {
	  const theme = useMantineTheme();


	const handlePrev = () => {
		if (isPrev) {
			setSelectedImage(images[index - 1]);
		}
	};

	const handleNext = () => {
		if (isNext) {
			setSelectedImage(images[index + 1]);
		}
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'ArrowLeft') {
			handlePrev();
		}
		if (e.key === 'ArrowRight') {
			handleNext();
		}
	};

	return (
		<Modal opened={opened} onClose={close} withCloseButton={false} onKeyDown={onKeyDown} size="lg" zIndex={9999}>
			<Box >
				{isPrev ? (
					<IconChevronLeft  onClick={handlePrev} />
				) : undefined}
				{isNext ? (
					<IconChevronRight onClick={handleNext} />
				) : undefined}
			</Box>
			<Text>
				{selectedImage ? selectedImage?.split(`inquiry/${inquiry?.id}/`)[1]?.split('?X')[0] : undefined}
			</Text>
			<Image 
			alt="inquiry image"
			src={selectedImage} onClick={close} />
			<Text>
				<a href={selectedImage} target="_blank" rel="noreferrer">
					Click to open in new window
				</a>
			</Text>
		</Modal>
	);
};

export default ImageModal;


 