import { ReactNode } from 'react';
import { IconCaretLeft, IconCaretRight } from '@tabler/icons-react';
import { Button, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
const BookingControls = ({
	next,
	previous,
	extra,
	showNext = true,
	showPrevious = true,
}: {
	next: () => void;
	previous: () => void;
	extra?: ReactNode;
	showNext: boolean;
	showPrevious?: boolean;
}) => {
	const { t } = useTranslation(['default']);
	return (
		<Group p="md" position="center">
			{showPrevious ? (
				<Button
				color={mantineConfig.mantine.button.back.backgroundColor}
			style={{
          color: mantineConfig.mantine.button.fontColor,
        }} 
					onClick={previous}
					leftIcon={<IconCaretLeft size={mantineConfig.mantine.button.iconSize} />}
				>
					{t('tr.back')}
				</Button>
			) : undefined}
			{extra}
			{showNext ? (
				<Button
					color={mantineConfig.mantine.button.backgroundColor}
						style={{
          color: mantineConfig.mantine.button.fontColor,
        }} 
					rightIcon={<IconCaretRight size={mantineConfig.mantine.button.iconSize} />}
					onClick={next}
				>
					{t('tr.next')}
				</Button>
			) : undefined}
		</Group>
	);
};
export default BookingControls;
