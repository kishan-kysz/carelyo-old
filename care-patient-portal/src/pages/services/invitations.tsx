import {
	Button,
	CopyButton,
	Group,
	Modal,
	Stack,
	TextInput,
	Container,
	Title,
	Text,
} from '@mantine/core';
import { IconSquareRoundedPlus } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { ConfirmDelete } from '../../components/core/confirm-delete';
import useInvitations from '../../hooks/use-invitation';
import { IInvitation } from '../../api/types';
import useProfile from '../../hooks/use-profile';
import { DataTable } from 'mantine-datatable';
import { datetime } from '../../utils/datetime';
import PageTitle from '../../components/core/page-title';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
import { t } from 'i18next';

const PAGE_SIZE = 10;

export const InvitationList = ({
	setSelected,
}: {
	invitation?: IInvitation;
	setSelected: (val: IInvitation) => void;
}) => {
	const { invitations } = useInvitations();
	const [page, setPage] = useState(1);
	const StyledText = ({ children }: { children: React.ReactNode }) => (
		<Text
			color={mantineConfig.mantine.text.color}
			size={mantineConfig.mantine.text.fontSize}
			weight={mantineConfig.mantine.text.fontWeight}
		>
			{children}
		</Text>
	);

	const StyledLabel = ({ children }: { children: React.ReactNode }) => (
		<Text
			color={mantineConfig.mantine.text.label.small.color}
			size={mantineConfig.mantine.text.label.small.fontSize}
			weight={mantineConfig.mantine.text.label.small.fontWeight}
		>
			{children}
		</Text>
	);
	return invitations ? (
		<Container size="md" p="sm" h={invitations.length < 5 ? 500 : 'auto'}>
			<DataTable
				striped={true}
				withColumnBorders={true}
				withBorder={true}
				shadow="xs"
				totalRecords={invitations.length}
				recordsPerPage={PAGE_SIZE}
				noRecordsText={t('tr.no-invitations-found')}
				page={page}
				onPageChange={(p) => setPage(p)}
				columns={[
					{
						title: <StyledLabel>{t('tr.name').toUpperCase()}</StyledLabel>,
						accessor: 'name',
						noWrap: true,
						render: (value) => <StyledText>{value.name}</StyledText>,
					},
					{
						title: <StyledLabel>{t('tr.status').toUpperCase()}</StyledLabel>,
						accessor: 'status',
						noWrap: true,
						render: (value) => <StyledText>{value.status}</StyledText>,
					},
					{
						title: (
							<StyledLabel>
								{t('tr.registration-date').toUpperCase()}
							</StyledLabel>
						),
						accessor: 'registrationDate',
						noWrap: true,
						render: (value) => (
							<StyledText>
								{value?.registrationDate
									? datetime(value.registrationDate).format('YYYY-MM-DD HH:mm')
									: t('tr.not-registered-yet')}
							</StyledText>
						),
					},
					{
						title: (
							<StyledLabel>{t('tr.invitation-date').toUpperCase()}</StyledLabel>
						),
						accessor: 'createdAt',
						noWrap: true,
						render: (value) => (
							<StyledText>{datetime(value.createdAt).format('LL')}</StyledText>
						),
					},
				]}
				records={invitations}
			/>
		</Container>
	) : null;
};

const InvitationForm = ({ close }: { close: () => void }) => {
	const { add, sendLoading } = useInvitations();
	const form = useForm({
		initialValues: {
			name: '',
			email: '',
		},
	});
	const handleSubmit = async (values: { name: string; email: string }) => {
		await add(values);
		close();
	};
	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Stack spacing="md">
				<Title
					color={mantineConfig.mantine.input.label.color}
					size={mantineConfig.mantine.input.label.fontSize}
					weight={mantineConfig.mantine.input.label.fontWeight}
				>
					{t('tr.full-name')}
				</Title>

				<TextInput
					placeholder="John Doe"
					description={t('tr.invite-email-of-person')}
					{...form.getInputProps('name')}
				/>
				<Title
					color={mantineConfig.mantine.input.label.color}
					size={mantineConfig.mantine.input.label.fontSize}
					weight={mantineConfig.mantine.input.label.fontWeight}
				>
					{t('tr.email')}
				</Title>
				<TextInput
					placeholder="john@gmail.com "
					description={t('tr.invite-email-of-person')}
					{...form.getInputProps('email')}
				/>
				<Button type="Submit" variant="outline" loading={sendLoading}>
					{t('tr.send-invitation')}
				</Button>
			</Stack>
		</form>
	);
};
const ReferralButton = () => {
	const { user } = useProfile();
	return (
		<CopyButton value={user?.referralCode || ''} timeout={3000}>
			{({ copied, copy }) => (
				<Button
					my={2}
					variant="light"
					color={copied ? 'blue' : 'teal'}
					onClick={copy}
				>
					{copied ? t(`tr.copied`) : t(`tr.copy-referral-code`)}
				</Button>
			)}
		</CopyButton>
	);
};
export const Invitation = () => {
	const [opened, { close, toggle }] = useDisclosure(false);
	const [deleteOpen, { close: closeDelete, toggle: toggleDelete }] =
		useDisclosure(false);
	const [selected, setSelected] = useState<IInvitation>();
	const { remove } = useInvitations();
	const handleDelete = async () => {
		if (!selected) {
			return;
		}
		await remove(selected.id);
	};
	const handleSelectDelete = (invitation: IInvitation) => {
		setSelected(invitation);
		toggleDelete();
	};
	return (
		<Container size="xl">
			<PageTitle
				heading={t('tr.invite-friend').toUpperCase()}
				rightSection={
					<Group>
						<ReferralButton />
						<Button
							variant="light"
							color="teal"
							onClick={toggle}
							rightIcon={<IconSquareRoundedPlus />}
						>
							{t('tr.make-new-invitation')}
						</Button>
					</Group>
				}
			/>
			{/* <Box
				sx={(theme) => ({
					backgroundColor:
						theme.colorScheme === 'dark'
							? theme.colors.dark[6]
							: theme.colors.teal[0],
					textAlign: 'center',
					padding: theme.spacing.xl,
					borderRadius: theme.radius.md,
					cursor: 'pointer',
				})}
			> */}
			{/* </Box> */}

			<InvitationList setSelected={handleSelectDelete} />
			<Modal
				opened={opened}
				onClose={close}
				title={t('tr.invite-people')}
				centered={true}
			>
				<InvitationForm close={close} />
			</Modal>
			<ConfirmDelete
				show={deleteOpen}
				onClose={closeDelete}
				onDelete={handleDelete}
				title={t('tr.delete-this-invitation')}
				message={`('tr.invite-delete-confirm') ${selected?.name}? `}
			/>
		</Container>
	);
};
