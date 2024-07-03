import { Stack, Text } from '@mantine/core';

export const ListItem = ({
	title,
	description,
}: {
	title: string;
	description: string;
}) => {
	return (
		<Stack
			p="xs"
			spacing={0}
			sx={(theme) => ({
				radius: theme.radius.md,
				backgroundColor: theme.colors.gray[2],

				'&:not(:last-child)': {
					marginBottom: 'sm',
				},
				':hover': {
					cursor: 'pointer',
					backgroundColor: theme.colors.gray[4],
				},
			})}
		>
			<Text color="dark.6" size="md">
				{title}
			</Text>
			<Text size="sm" color="dark.3" p={5}>
				{description}
			</Text>
		</Stack>
	);
};
