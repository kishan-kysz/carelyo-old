import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Paper, createStyles, Box } from '@mantine/core';
import MessagesList from '../components/messages/message-list';
import PageTitle from '../components/core/page-title';
import Container from '../components/layout/container';
import LoadingIndicator from '../components/loading-indicator';
import useMessages from '../hooks/use-messages';
import AccordionMessages from '../components/messages/accordion-messages';
import MessageContent from '../components/messages/message-content';

export const Messages = () => {
	const { t } = useTranslation(['default']);
	const { messages: fetchedMessages, isLoading } = useMessages();
	const messages = fetchedMessages || [];
	const [selected, setSelected] = useState<number | null>(null);
	const handleSelected = (id: number) => {
		setSelected((prevSelected) => (prevSelected === id ? null : id));
	};
	const selectedMessage = useMemo(
		() => messages.find((message) => message.id === selected),
		[messages, selected]
	);

	const { classes } = useStyles();

	if (isLoading) {
		return <LoadingIndicator />;
	}

	return (
		<Container>
			<PageTitle heading={`${t('tr.messages').toUpperCase()}`} />
			<Grid h="100%" w="100%" p="sm">
				<Grid.Col span={12} md={4}>
					<Box className={classes.hideOnDesktop}>
						<AccordionMessages
							messages={messages}
							isLoading={isLoading}
							onSelect={handleSelected}
							isMobileOrTablet={true}
						/>
					</Box>
					<Box className={classes.showOnDesktop} style={{ width: '100%' }}>
						<Paper withBorder radius="md" style={{ height: '100%' }}>
							<MessagesList
								messages={messages}
								isLoading={isLoading}
								onSelect={handleSelected}
								// isMobileOrTablet={false}
							/>
						</Paper>
					</Box>
				</Grid.Col>

				<Grid.Col span={12} md={8} className={classes.showOnDesktop}>
					{selectedMessage && <MessageContent message={selectedMessage} />}
				</Grid.Col>
			</Grid>
		</Container>
	);
};

const useStyles = createStyles(() => ({
	hideOnDesktop: {
		display: 'block',
		[`@media (min-width: 920px)`]: {
			display: 'none',
		},
	},
	showOnDesktop: {
		display: 'block',
		[`@media (max-width: 920px)`]: {
			display: 'none',
		},
	},

	responsiveMobileText: {
		[`@media (max-width: 768px)`]: {
			display: 'flex',
			gap: '2px',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'flex-start',
			fontSize: '16px',
		},
	},
}));

export default Messages;
