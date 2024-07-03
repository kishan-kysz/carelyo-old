import { Badge, MantineSize } from '@mantine/core';
import { StatusTypes } from '../../helper/utils/types';

const StatusBadge = ({
	status,
	size = 'md',
	label,
	...restProps
}: {
	status: StatusTypes;
	size?: MantineSize;
	label?: string;
}) => {
	switch (status) {
		case 'Open': {
			return (
				<Badge color="blue" size={size} {...restProps}>
					{label ? label : status}
				</Badge>
			);
		}
		case 'Viewed': {
			return (
				<Badge color="yellow" size={size} {...restProps}>
					{label ? label : status}
				</Badge>
			);
		}
		case 'Investigating': {
			return (
				<Badge color="grape" size={size} {...restProps}>
					{label ? label : status}
				</Badge>
			);
		}
		case 'Closed': {
			return (
				<Badge color="red" size={size} {...restProps}>
					{label ? label : status}
				</Badge>
			);
		}
		case 'Resolved': {
			return (
				<Badge color="green" size={size} {...restProps}>
					{label ? label : status}
				</Badge>
			);
		}
		case 'Deleted': {
			return (
				<Badge color="gray" size={size} {...restProps}>
					{label ? label : status}
				</Badge>
			);
		}
		default: {
			return (
				<Badge color="gray" size={size} {...restProps}>
					{label ? label : status}
				</Badge>
			);
		}
	}
};

export default StatusBadge;
