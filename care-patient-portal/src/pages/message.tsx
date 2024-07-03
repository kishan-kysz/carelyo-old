import {
	Avatar,
	Box,
	createStyles,
	Flex,
	Group,
	Paper,
	Text,
	Title,
} from '@mantine/core';
import { useParams } from 'react-router-dom';
import useMessages from '../hooks/use-messages';
import Container from '../components/layout/container';
import LoadingIndicator from '../components/loading-indicator';
import BackButton from '../components/core/back-button';
import dayjs from 'dayjs';
// Assuming you have a Footer component

const CostumPageTitle = () => {
	return (
		<Group p="xs" w="100%">
			<BackButton />
		</Group>
	);
};

export const Message = () => {
	const { messageId } = useParams<'messageId'>();
	const { fetchMessageByID } = useMessages();
	const { data: message } = fetchMessageByID(Number(messageId));
	const { classes } = useStyles();
	const extractContent = (html: string) => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');
		return doc.body.textContent || '';
	};

	const strippedMessage = message?.message
		? extractContent(message.message)
		: '';

	const formatMessage = (message: string) => {
		const cleanedMessage = message.replace(
			/please\s*login\.?|Login|or\s*login\s*here/gi,
			''
		);
		const paragraphs = cleanedMessage
			.split('\n')
			.filter((paragraph) => paragraph.trim() !== '');

		return paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>);
	};

	const formattedMessage = strippedMessage
		? formatMessage(strippedMessage)
		: null;

	return message ? (
		<div className={classes.pageWrapper}>
			<Container
				sx={{ flex: '1', justifyContent: 'flex-start', paddingBottom: '4rem' }}
			>
				{/* <PageTitle heading={message?.subject} /> */}
				<CostumPageTitle />
				<Paper withBorder={true} radius="md" className={classes.wrapper}>
					<Box classNames={classes.messageHeader}>
						<Title px="md" className={classes.responsiveTitle} color="black">
							{message.subject}
						</Title>
						<Flex p="md" align="center" justify="flex-start" gap="sm">
							<Avatar size="lg" src="#" color="cyan" radius="md">
								C
							</Avatar>
							<Box>
								<Title order={4}>From: {message.sender || 'sender'}</Title>
								<Text color="black">Subject: {message.subject}</Text>
								<Text color="black">
									Recieved:{' '}
									{dayjs(message?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
								</Text>
							</Box>
						</Flex>
					</Box>
					<Box>
						<Text>
							{message?.message ? (
								<Paper
									py={0}
									classNames={classes.body}
									radius="md"
									style={{
										padding: 0,
										borderRadius: 'md',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										textAlign: 'left',
										minHeight: '300px',
										color: 'blue',
									}}
								>
									<Text
										size="xl"
										style={
											{
												/* Your inline styles here */
											}
										}
									>
										{formattedMessage}
									</Text>
								</Paper>
							) : (
								<Text>Missing message content</Text>
							)}
						</Text>
					</Box>
					{/* <div className={classes.title}>
						<div className={classes.fromSection}>
							<Title order={4} weight={600} color="dark">
								From
							</Title>
							<div className={classes.senderInfo}>
								<Text size="md" color="dark">
									info@carelyo.com
								</Text>
								<Text size="md" color="dark">
									
								</Text>
							</div>
						</div>
					</div> */}
				</Paper>
			</Container>
		</div>
	) : (
		<LoadingIndicator />
	);
};

const useStyles = createStyles((theme) => ({
	pageWrapper: {
		display: 'flex',
		flexDirection: 'column',
	},
	wrapper: {
		boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
		border: `1px solid ${theme.colors.gray}`,
		width: '100%',
		padding: '2rem 1rem',

		margin: '1rem auto',
		borderRadius: '10px',
		minHeight: 700,
	},
	title: {
		margin: '2rem',
	},
	fromSection: {
		display: 'flex',
		alignItems: 'center',
	},
	senderInfo: {
		marginLeft: '2rem',
	},
	body: {
		fontSize: theme.fontSizes.sm,
		color: 'black',
		padding: '1rem',
	},
	content: {
		'& > p': {
			marginBottom: '1rem',
			fontSize: 15, // Adjust the spacing between paragraphs here
		},
		whiteSpace: 'pre-wrap',
		maxHeight: '50vh',
		overflowY: 'auto',
		margin: '1rem 0',
	},
	messageHeader: {
		border: '1px solid #e0e0e0',
		padding: theme.spacing.md,
	},
	responsiveTitle: {
		[theme.fn.smallerThan('md')]: {
			fontSize: '1.5rem',
		},
		[theme.fn.smallerThan('sm')]: {
			fontSize: '1.2rem',
		},
		[theme.fn.smallerThan('lg')]: {
			fontSize: '1.8rem',
		},
	},
}));

export default Message;
