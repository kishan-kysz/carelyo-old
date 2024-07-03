import { CopyButton, ActionIcon, Tooltip } from '@mantine/core';
import {
	IconCopy,
	IconCheck,
	IconMail,
	IconPhone,
	IconUser,
	IconUserCircle,
	IconClockEdit,
	IconClock,
	IconClockCancel
} from '@tabler/icons-react';


const Icon = ({ type, size }: { type?: string; size: string }) => {
	switch (type) {
		case 'name': {
			return <IconUser size={size} />;
		}
		case 'mail': {
			return <IconMail size={size} />;
		}
		case 'phone': {
			return <IconPhone size={size} />;
		}
		case 'role': {
			return <IconUserCircle size={size} />;
		}
		case 'created': {
			return <IconClock size={size} />;
		}
		case 'updated': {
			return <IconClockEdit size={size} />;
		}
		case 'resolved': {
			return <IconClockCancel size={size} />;
		}
		default: {
			return <IconCopy size={size} />;
		}
	}
};

const CopyButtonIcon = ({
	value,
	type,
	size = '1rem',
	tooltip,
	...restProps
}: {
	value: string;
	type?: string;
	size?: string;
	tooltip?: string;
}) => {
	return (
		<CopyButton value={value} timeout={2000}>
			{({ copied, copy }: { copied: boolean; copy: () => void }) => (
				<Tooltip label={copied ? 'Copied' : tooltip ? tooltip : 'Copy'} withArrow position="right">
					<ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}  {...restProps}>
						{copied ? <IconCheck size="1rem" /> : <Icon type={type} size={size} />}
					</ActionIcon>
				</Tooltip>
			)}
		</CopyButton>
	);
};

export default CopyButtonIcon;
