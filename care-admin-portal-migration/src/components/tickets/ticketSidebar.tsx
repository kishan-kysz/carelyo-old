import {
	Box,
	Text,
	Container,
	Select,
	Title,
	Loader,
	MultiSelect,
	CloseButton,
	useMantineTheme,
	Button,
	Menu,
} from '@mantine/core';
import {createStyles} from '@mantine/styles';
import { useEffect, useState } from 'react';
import { IGetTicketByID , IGetUsersResponse } from '../../helper/utils/types';
import useUsers from '../../helper/hooks/useUsers';
import { useUser } from '../../helper/hooks/useUser';
import useTicketActions from '../../helper/hooks/useTicketActions';

import Cookies from 'js-cookie';
import { IconChevronDown } from '@tabler/icons-react';
import { CircleCheck, CircleX } from 'tabler-icons-react';
import StatusBadge from '../inquiry/StatusBadge';
import useInquiry from '../../helper/hooks/useInquiry';

const TicketSideBar = ({ ticket }: { ticket: IGetTicketByID }) => {
	const { colors, fontSizes } = useMantineTheme();

	const { classes } = useStyles();
	const { users } = useUsers();
	const [admins, setAdmins] = useState<IGetUsersResponse[]>([]);
	const [assigneeId, setAssigneeId] = useState<string | null>('');
	const [tags, setTags] = useState<string[]>([]);
	const [category, setCategory] = useState<string | null>();
	const [type, setType] = useState<string | null>();
	const [priority, setPriority] = useState<string | null>();
	const [status, setStatus] = useState<string | null>();
	const [disabled, setDisabled] = useState<boolean>(false);
	const { user } = useUser(Number(Cookies.get('SYSTEMADMIN_userId')));

	const { assign, updateCategory, updateType, updatePriority, updateStatus, unAssign, addTag, removeTag, loading } =
		useTicketActions();

	const { updateStatus: updateInquiryStatus } = useInquiry(Number(ticket?.inquiry?.id));

	useEffect(() => {
		if (users) {
			setAdmins(users.filter((user) => user.role === 'SYSTEMADMIN'));
		}
	}, [users]);

	useEffect(() => {
		if (ticket?.assignee?.userId) {
			setAssigneeId(ticket?.assignee?.userId?.toString());
		}
		if (ticket?.tags) {
			setTags(ticket.tags);
		}
		if (ticket?.category) {
			setCategory(ticket.category);
		}
		if (ticket?.type) {
			setType(ticket.type);
		}
		if (ticket?.priority) {
			setPriority(ticket.priority);
		}
		if (ticket?.status) {
			setStatus(ticket.status);
		}
	}, [ticket]);

	useEffect(() => {
		if (ticket?.status === 'Resolved' || ticket?.status === 'Closed' || ticket?.status === 'Deleted') {
			setDisabled(true);
		} else {
			setDisabled(false);
		}
	}, [ticket?.status]);

	return (
		<>
			<Container>
				<Box className={classes.gridHeader} >
					<Title  size="h3" fw={700}>
						Ticket Details
					</Title>
					{loading ? (
						<Loader
							size={'sm'}
							
						/>
					) : undefined}
				</Box>

				<Container style={{ display: 'grid', gap: 8, padding: 16 }}>
					<Text fz={14} fw={600}>
						ID: {ticket?.id}
					</Text>
					<Box >
						<Select
							w="100%"
							label="Assignee"
						
							data={admins.map((admin) => {
								return {
									label: admin.email,
									value: admin.id.toString()
								};
							})}
							placeholder="Pick assignee for this ticket"
							clearable
							searchable
							radius="sm"
							size="sm"
							value={assigneeId}
							onChange={(value) => {
								setAssigneeId(value);
								if (!value) {
									unAssign({ id: ticket.id });
								} else {
									assign({ id: ticket.id, assigneeId: Number(value) });
								}
							}}
							disabled={disabled}
						/>
						{!disabled ? (
							<Text
								
								onClick={() => {
									if (user?.id && assigneeId !== user?.id.toString()) {
										setAssigneeId(user?.id.toString());
										assign({ id: ticket.id, assigneeId: Number(user?.id) });
										return;
									}
									setAssigneeId(null);
									unAssign({ id: ticket.id });
								}}
							>
								{assigneeId === user?.id.toString() ? 'unassign' : 'assign to me'}
							</Text>
						) : undefined}
					</Box>

					<MultiSelect
						data={[...tags]}
						searchable
						placeholder='---Add tags---'
						label="Add tags"
						getCreateLabel={(query) => `+Add ${query}`}
						valueComponent={({
							value,
							label,
							onRemove,
							classNames,
							...restprops
						}: MultiSelectValueProps & { value: string }) => (
							<div {...restprops}>
								<Box>
									<Text >{value}</Text>
									<CloseButton
										size={'xs'}
										onMouseDown={() => {
											removeTag({ id: ticket.id, tag: value });
											setTags((prev) => prev.filter((item) => item !== value));
										}}
									/>
								</Box>
							</div>
						)}
						value={tags}
						onChange={(values) => {
							if (values.length > tags.length) {
								const tag = values.filter((v) => !tags.includes(v));
								addTag({ id: ticket.id, tag: tag[0] });
							} else {
								const tag = tags.filter((t) => !values.includes(t));
								removeTag({ id: ticket.id, tag: tag[0] });
							}
							setTags(values);
						}}
						disabled={disabled}
					/>
					<Select
						label="Category"
						size="sm"
						data={['Account', 'Billing', 'General', 'Other']}
						placeholder='Select type'
						value={category}
						onChange={(value) => {
							setCategory(value);
							if (value) {
								updateCategory({ id: ticket.id, category: value });
							}
						}}
						disabled={disabled}
					/>
					<Select
						label="Type"
						size="sm"
						data={['Bug', 'Feature', 'Other', 'Question']}
						placeholder='Select type'
						value={type}
						onChange={(value) => {
							setType(value);
							if (value) {
								updateType({ id: ticket.id, type: value });
							}
						}}
						disabled={disabled}
					/>
					<Select
						label="Priority"
						size="sm"
						placeholder='Select priority'
						data={['Critical', 'High', 'Medium', 'Low']}
						value={priority}
						onChange={(value) => {
							setPriority(value);
							if (value) {
								updatePriority({ id: ticket.id, priority: value });
							}
						}}
						disabled={disabled}
					/>
					<Select
						label="Status"
						size="sm"
						placeholder='---Select status---'
						data={['Open', 'Viewed', 'Investigating']}
						value={status}
						onChange={(value) => {
							setStatus(value);
							if (value) {
								updateStatus({ id: ticket.id, status: value });
							}
						}}
						disabled={disabled}
					/>
					<Box mt={40} >
						<CloseTicketButton
							updateStatus={updateStatus}
							updateInquiryStatus={updateInquiryStatus}
							ticketId={ticket?.id}
							inquiryId={ticket?.inquiry?.id}
						/>
					</Box>
				</Container>
			</Container>
		</>
	);
};

const CloseTicketButton = ({
	ticketId,
	inquiryId,
	updateStatus,
	updateInquiryStatus
}: {
	ticketId: number;
	inquiryId: number;
	updateStatus: ({ id, status }: { id: number; status: string }) => void;
	updateInquiryStatus: ({ id, status }: { id: number; status: string }) => void;
}) => {
	const { colors } = useMantineTheme();
	return (
		<Menu position="bottom" width={180} withinPortal>
			<Menu.Target>
				<Button pr={12}>
					Close Ticket
				</Button>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Item rightSection={<CircleCheck size="1rem" color={colors.green[6]} />}>
					<Box
						onClick={() => {
							updateStatus({ id: ticketId, status: 'Resolved' });
							updateInquiryStatus({ id: inquiryId, status: 'Resolved' });
						}}
					>
						<StatusBadge status={'Resolved'} label="Resolve" />
					</Box>
				</Menu.Item>
				<Menu.Item rightSection={<CircleX size="1rem" color={colors.red[6]} />}>
					<Box
						onClick={() => {
							updateStatus({ id: ticketId, status: 'Closed' });
							updateInquiryStatus({ id: inquiryId, status: 'Closed' });
						}}
					>
						<StatusBadge status={'Closed'} label="Close" />
					</Box>
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
};

const useStyles = createStyles(() => ({
	gridHeader: { borderBottom: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', padding: 16, width: '100%' }
}));

export default TicketSideBar;
