import {
    Paper,
    createStyles,
    Box,
    Avatar,
    Text,
    Title,
    Divider,
    Flex,
} from '@mantine/core';
import dayjs from 'dayjs';
import { IMessageResponse } from '../../api/types';



const MessageContent = ({ message }: { message: IMessageResponse }) => {
	const { classes } = useStyles();
	const extractContent = (html: string) => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');
		return doc.body.textContent || '';
	};
    const cleanText = (text: string) => {
        return text
          .replace(/\s+/g, ' ') 
          .trim(); 
      };
      const strippedMessage = message?.message
    ? cleanText(extractContent(message.message))
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


		const getAvatarLetter = (sender: string | undefined) => {
			if (sender) {
			  return sender.charAt(0); 
			}
			return 'S'; 
		  };
		  
		  const avatarLetter = getAvatarLetter(message.sender);
		  return (
			
			<Paper withBorder={true} radius="md" h="100%">
				<Box className={classes.messageHeader}>
					<Title px="md" className={classes.responsiveTitle} color="black">
						{message.subject}
					</Title>
					<Flex p="md" align="center" justify="flex-start" gap="sm">
				
						<Avatar className={classes.avatar} size="xl" src="#" color="cyan" radius="md">
							{avatarLetter}
						</Avatar>
						<Box>
						<Flex align="center" justify="flex-start" gap="sm" className={classes.responsiveMobileText}>
							<Text style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>From:</Text>
							<Text>{message.sender || 'Sender'}</Text>
						</Flex>
						<Flex    align="center" justify="flex-start" gap="sm" className={classes.responsiveMobileText}>
							<Text style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>Subject:</Text>
							<Text>{message.subject}</Text>
						</Flex>
						<Flex align="center" justify="flex-start" gap="sm" className={classes.responsiveMobileText}>
							<Text style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>Received:</Text>
							<Text>{dayjs(message?.createdAt).format('DD-MM-YYYY HH:mm:ss')}</Text>
						</Flex>
							<Divider my="sm" variant="dashed" />
						</Box>
					</Flex>
				</Box>
				<Box>
					<Text>
						{message?.message ? (
							<Paper
								py={0}
								className={classes.body}
								radius="md"
								style={{
									padding: '0 35px',
									borderRadius: 'md',
									display: 'flex',
									justifyContent: 'flex-start',
									alignItems: 'flex-start',
									minHeight: '300px',
									color: 'black',
									maxWidth: '100%', 
									overflow: 'auto'
								
									
									
								}}
							>
								 {formattedMessage && <Text size="xl">{formattedMessage}</Text>}
							</Paper>
						) : (
							<Text>Missing message content</Text>
						)}
					</Text>
				</Box>
			</Paper>
			
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
	
	body: {
	  fontSize: theme.fontSizes.sm,
	  color: 'black',
	  padding: '1rem',
	 
	},
	content: {
	  '& > p': {
		marginBottom: '1rem',
		fontSize: 15,
		
	  },
	  whiteSpace: 'pre-wrap',
	  maxHeight: '50vh',
	  overflowY: 'auto',
	  margin: '1rem 0',
	  },
	messageHeader: {
	  border: '0px solid #e0e0e0',
	  padding: theme.spacing.md,
	  textTransform:'uppercase',
	},
	responsiveTitle: {
	  fontSize: '2rem', 
	  [theme.breakpoints.xs]: {
		fontSize: '2.8rem', 
	  },
	  [theme.breakpoints.sm]: {
		fontSize: '3rem', 
	  },
	  [theme.breakpoints.md]: {
		fontSize: '2.5rem', 
	  },
	  [theme.breakpoints.lg]: {
		fontSize: '2.5rem', 
	  },
	  [theme.breakpoints.xl]: {
		fontSize: '2.5rem', 
	  },
	  [`@media (max-width: 768px)`]: {
		fontSize:'1.6rem',
	  },

	},
    avatar: {
		display: 'block',
		[`@media (max-width: 768px)`]: {
		  display: 'none',
		},
	  },

      responsiveMobileText: {
		[`@media (max-width: 768px)`]: {
			display: 'flex',
	        gap:'2px',
	        flexDirection: 'column',
	        justifyContent: 'center',
	        alignItems:'flex-start',
	        fontSize:'16px',


		  },
	  },
	
}));

export default MessageContent