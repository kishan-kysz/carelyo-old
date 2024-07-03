import { IActionsTaken } from '../../helper/utils/types';
import { Timeline, Text, ScrollArea } from '@mantine/core';

const Interactions = ({ actions }: { actions: IActionsTaken[] }) => {
	const ticketInteractions = actions
		.sort((a: IActionsTaken, b: IActionsTaken) => {
			if (a.id < b.id) {
				return 1;
			} else if (a.id > b.id) {
				return -1;
			} else {
				return 0;
			}
		})
		.map((action) => {
			return (
				<Timeline.Item key={action.id}>
					<Text size="sm">
						<Text fw={700}>{action.action}</Text>{' '}
					</Text>
					<Text size="xs">
						<Text size='xs'>{action.message}</Text>{' '}
					</Text>
					<Text size="xs">
						<Text component="span" fw={700}>
							{action.createdAt.replace('T', ' ').slice(0, 19)}
						</Text>{' '}
					</Text>
				</Timeline.Item>
			);
		});

	return (
		<ScrollArea h={450} offsetScrollbars>
			<Timeline color="teal" active={actions.length} reverseActive lineWidth={3}>
				{ticketInteractions}
			</Timeline>
		</ScrollArea>
	);
};

export default Interactions;
