import { Button, Group, Modal, Text } from '@mantine/core';

interface DeleteModalProps {
	show: boolean;
	name?: string;
	onClose: () => void;
	onDelete: Function;
	title: string;
	message: string;
	loading?: boolean;
}

export const ConfirmDelete = ({
	show,
	name,
	onClose,
	onDelete,
	title,
	message,
	loading,
}: DeleteModalProps) => {
	return (
		<Modal opened={show} onClose={onClose} centered={true} title={title}>
			<Text>{message}</Text>
			<Text color="teal.7" align="center">
				{name}
			</Text>
			<Text mt="md" align="center" size="xs" color="red">
				This action cannot be undone.
			</Text>
			<Group position="right" mt="md">
				<Button size="xs" color="blue" loading={loading} onClick={onClose}>
					Cancel
				</Button>
				<Button
					size="xs"
					color="red"
					loading={loading}
					onClick={async () => {
						await onDelete();
						onClose();
					}}
				>
					Delete
				</Button>
			</Group>
		</Modal>
	);
};
