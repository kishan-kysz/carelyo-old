import { IComments } from '../../helper/utils/types';
import { Fragment , useState } from 'react';
import { Box, Text } from '@mantine/core';
import { useUser } from '../../helper/hooks/useUser';


const CommentItem = ({ comment }: { comment: IComments }) => {
	const { user } = useUser(comment.userId);

	const [message, setMessage] = useState(comment.message);

	return (
		<Fragment>
			<Box >
				<Text size="xs" color='teal' fw={700}>
					{user?.fullName}
				</Text>
				<Text size="xs" color='teal' fw={700}>
					On {comment.createdAt.replace('T', ' ').slice(0, 16)}
				</Text>
			</Box>
			<Box aria-label='whats in the box'>
				<Text mt={2} size="sm">
					{message}
				</Text>
			</Box>
		</Fragment>
	);
};

export default CommentItem;
