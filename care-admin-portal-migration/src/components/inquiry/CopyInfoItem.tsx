import { Box, MantineSize, Text, useMantineTheme } from '@mantine/core';
import CopyButtonIcon from './CopyButtonIcon';

const CopyInfoItem = ({
	value,
	type,
	label,
	tooltip,
	size
}: {
	value: string;
	type?: string;
	label?: string;
	tooltip?: string;
	size?: MantineSize;
}) => {
	const { colors } = useMantineTheme();
	return (
		<Box pos="relative" display="flex" p="md">
			<CopyButtonIcon value={value} type={type} tooltip={tooltip} />
			<Text
				size={size ? size : 'md'}
				pl={32}
				pt={2}
			
			>
				{label ? label : value}
			</Text>
		</Box>
	);
};

export default CopyInfoItem;
