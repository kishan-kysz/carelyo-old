import { Button, Title, Box, ActionIcon, Textarea, Modal, Text , ScrollArea } from '@mantine/core';
import { useForm } from '@mantine/form';
import {createStyles} from '@mantine/styles';
import { IGetTicketByID } from '../../helper/utils/types';
import CommentItem from './CommentItem';
import { useEffect, useState } from 'react';
import useComment from '../../helper/hooks/useComment';
import { Edit, Trash } from 'tabler-icons-react';
import { useDisclosure } from '@mantine/hooks';
import { IconSquareX, IconWritingSign } from '@tabler/icons-react';

enum ModalState {
	delete,
	edit,
	default
}

interface ICommentState {
	id: number | undefined;
	message: string;
}

const Comment = ({ ticket }: { ticket: IGetTicketByID }) => {
	const { classes } = useStyles();
	const { addComment, loading, deleteComment, updateComment } = useComment(ticket?.id);
	const [modalState, setModalState] = useState(ModalState.default);
	const [hoveredCommentId, setHoveredCommentId] = useState<number | null>(null);
	const [comment, setComment] = useState<ICommentState | undefined>();
	const [opened, { open, close }] = useDisclosure(false);
	const [editedComment, setEditedComment] = useState<ICommentState | undefined>();

	const handleMouseEnter = (commentId: number) => {
		setHoveredCommentId(commentId);
	};

	const handleMouseLeave = () => {
		setHoveredCommentId(null);
	};

	const handleDeleteComment = (ticketId: number) => {
		deleteComment({ commentId: comment?.id, ticketId: ticketId });
		close();
	};

	const handleEditComment = (commentId: number | undefined, ticketId: number, message: string) => {
		if (!commentId) return;
		if (editedComment?.message) updateComment({ commentId, ticketId, message: editedComment.message });
	};

	const form = useForm({
		initialValues: {
			ticketId: ticket?.id,
			message: ''
		}
	});

	useEffect(() => {
		form.values.message = '';
	}, [addComment, loading, form.values]);

	return (
		<div className={classes.comments}>
			<>
				{modalState === ModalState.delete ? (
					<Modal opened={opened} onClose={close} title="Delete comment">
						<Box className={classes.modalBody}>
							<Text size="sm">Are you sure you want to delete this comment?</Text>
							<Box className={classes.modalButtonContainer}>
								<Button size="xs" color='red' onClick={() => handleDeleteComment(ticket.id)}>
									<Trash size={24} />
									Confirm
								</Button>
								<Button onClick={() => close()} size="xs">
									<IconSquareX size={24} />
									Cancel
								</Button>
							</Box>
						</Box>
					</Modal>
				) : modalState === ModalState.edit ? (
					<Modal title="Edit comment" opened={opened} onClose={close}>
						<Box className={classes.modalBody}>
							<form onSubmit={form.onSubmit((values) => handleEditComment(comment?.id, ticket.id, values.message))}>
								<Textarea
									label="Edit previous comment "
									value={editedComment?.message}
									placeholder={comment?.message}
									onChange={(event) => setEditedComment({ id: comment?.id, message: event.target.value })}
								/>

								<Box className={classes.modalButtonContainer}>
									<Button type='submit' size="xs" onClick={() => close()}>
										<IconWritingSign size={24} />
										Update
									</Button>
									<Button type='submit' onClick={() => close()} size="xs">
										<IconSquareX size={24} />
										Cancel
									</Button>
								</Box>
							</form>
						</Box>
					</Modal>
				) : (
					<></>
				)}
			</>

			<Title size={'xs'}>Comments</Title>
			<ScrollArea h={250} className={classes.commentContainer}>
				{ticket.comments.length > 0 ? (
					<>
						{' '}
						{ticket?.comments
							.sort((a, b) => b.id - a.id)
							.map((item) => (
								<Box
									
									className={classes.messageBox}
									key={item.id}
									onMouseEnter={() => handleMouseEnter(item?.id)}
									onMouseLeave={handleMouseLeave}
								>
									{hoveredCommentId === item.id && (
										<Box className={classes.messageBoxControls}>
											<ActionIcon
												variant="transparent"
												size={18}
												color='red'
												onClick={() => {
													setModalState(ModalState.delete);
													open();
												}}
											>
												<Trash onClick={() => setComment({ id: item.id, message: item.message })} />
											</ActionIcon>
											<ActionIcon
												variant="transparent"
												size={18}
												color='teal'
												onClick={() => {
													setModalState(ModalState.edit);
													open();
												}}
											>
												<Edit onClick={() => setComment({ id: item.id, message: item.message })} />
											</ActionIcon>
										</Box>
									)}
									<CommentItem comment={item} />
								</Box>
							))}
					</>
				) : (
					<>
						<Text size="xs">No comments...</Text>
					</>
				)}
			</ScrollArea>
			<form
				onSubmit={form.onSubmit((values) => {
					values.ticketId = ticket?.id;
					addComment(values);
				})}
			>
				<Textarea
					withAsterisk
					required
					maxLength={120}
					{...form.getInputProps('message')}
					placeholder='Enter a comment'
					value={form.values.message}
				/>
				<input type="submit" hidden={true} />
				<Button mt={8} mb={8} display="inline-block" type='submit'>
					Add comment
				</Button>
			</form>
		</div>
	);
};
const useStyles = createStyles((theme) => ({
	comments: {
		display: 'grid',
		gap: 16
	},
	commentContainer: {
		border: '1px solid #E0E0E0',
		padding: '8px',
		borderRadius: theme.radius.sm
	},
	messageBox: {
		display: 'grid',
		padding: 8,
		'&:hover': { backgroundColor: theme.colorScheme === 'dark' ? '#282828' : '#E0E0E0' }
	},
	modalBody: {},
	modalButtonContainer: {
		display: 'flex',
		justifyContent: 'flex-end',
		gap: 16,
		marginTop: 16
	},
	messageBoxControls: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		gap: 4
	}
}));
export default Comment;
