import { Box, TextInput, Textarea, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import useMessage from '../../helper/hooks/useMessage';
import { showNotification } from '@mantine/notifications';

const MessageModal = ({ userId, close, re }: { userId: number; close: () => void; re: string }) => {
	const { send, loading } = useMessage();

	const onSubmit = async (values: { sender: string; subject: string; message: string }) => {
		const payload = {
			userId,
			sender: values.sender,
			subject: values.subject,
			message: values.message
		};
		await send(payload, {
			onSuccess: () => {
				close();
				showNotification({
					message: 'Message sent',
					autoClose: 2500
				});
			},
			onError: () => {
				close();
				showNotification({
					message: 'Something went wrong',
					autoClose: 2500,
					color: 'red'
				});
			}
		});
		form.reset();
	};

	const form = useForm({
		initialValues: {
			sender: 'Carelyo',
			subject: `RE: ${re}`,
			message: ''
		}
	});

	return (
		<form onSubmit={form.onSubmit(onSubmit)}>
			<TextInput label="Sender" placeholder='Enter sender' required {...form.getInputProps('sender')} />
			<TextInput label="Subject" placeholder='Enter subject' required {...form.getInputProps('subject')} />
			<Textarea
				mt={12}
				label="Message"
				placeholder='Enter message'
				required
				data-autofocus
				{...form.getInputProps('message')}
			/>
			<Box >
				<Button type='submit' mt={12} loading={loading}>
					Send
				</Button>
			</Box>
		</form>
	);
};

export default MessageModal;
