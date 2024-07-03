import {
  Avatar,
  createStyles,
  Group,
  Text,
  
} from '@mantine/core';
import { IconChevronRight} from '@tabler/icons-react';
import { IMessageResponse } from '../../api/types';

const MessagePreview = ({
  messageItem,
  onSelect,
  isMobile
}: {
  messageItem: IMessageResponse;
  // eslint-disable-next-line no-unused-vars
  onSelect: (id: number) => void;
  isMobile: boolean;
}) => {
	const { classes } = useStyles();
	const { sender, subject } = messageItem;
	const avatarLetter = sender ? sender.charAt(0) : 'S';

	
	  
  return (
    <div
       onClick={()=>{
				onSelect(messageItem.id)
			}} className={classes.user}>
        <Group>
          <Avatar alt="Sender Avatar" color="teal" radius={50} size="md">
            {avatarLetter}
          </Avatar>
          <div style={{ flex: 1 }}>
            <Text size="lg" weight={500} style={{ textTransform: "uppercase" }}>
              {sender || 'Sender'}
            </Text>
            <Text color="black" size="lg">
              {subject}
            </Text>
          </div>
          {!isMobile && <IconChevronRight size={14} stroke={1.5} />}
        </Group>
        
      
    </div>
  );
};

export default MessagePreview;

const useStyles = createStyles((theme) => ({
	user: {
		display: 'block',
		width: '100%',

		padding: theme.spacing.md,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark'
					? theme.colors.dark[8]
					: theme.colors.teal[0],
		},

		[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
             padding: theme.spacing.sm,
            },
	},
	
}));
