import useProfile from '../../hooks/use-profile';
import { IProfileResponse } from '../../api/types';
import {
	Badge,
	Button,
	Card,
	Group,
	keyframes,
	Menu,
	Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { datetime } from '../../utils/datetime';
import { t } from 'i18next';

export const HasUnratedConsultations = ({
	handleOpen,
}: {
	handleOpen: (id: number) => void;
}) => {
	const { user } = useProfile();

	const hasUnratedConsultations =
		user?.unratedConsultation && user.unratedConsultation.length > 0;
	const [opened, { open, close }] = useDisclosure(false);
	const onModalOpen = (id: number) => {
		handleOpen(id);
		close();
	};
	const UnratedConsultationNotifications = ({
		consultations,
		onClick,
	}: {
		consultations: IProfileResponse['unratedConsultation'];
		onClick: (id: number) => void;
	}) => {
		return consultations.map((consultation) => {
			return (
				<Card
					key={consultation.id}
					shadow="xs"
					sx={(t) => ({
						':not(:last-child)': { marginBottom: t.spacing.xs },
					})}
				>
					<Card.Section p="sm">
						<Text>
							{t('tr.rate-meeting')}{' '}
							{consultation.doctorName}
						</Text>
					</Card.Section>
					<Card.Section p="sm">
						<Group position="apart">
							<Text>
								{t('tr.on')} {datetime(consultation.date).format('LL')}
							</Text>
							<Button onClick={() => onClick(consultation.id)} size="xs">
								{t('tr.rate-now')}{t('tr.ratenow')}
							</Button>
						</Group>
					</Card.Section>
				</Card>
			);
		});
	};

	const shake = keyframes({
		'30%': { transform: 'scale(1.2)' },
		'40%, 60%': { transform: 'rotate(-20deg) scale(1.2)' },
		'50%': { transform: 'rotate(20deg) scale(1.2)' },
		'70%': { transform: 'rotate(0deg) scale(1.2)' },
		'100%': { transform: 'scale(1)' },
	});
	return hasUnratedConsultations ? (
		<Menu onOpen={open} onClose={close} opened={opened} withArrow>
			<Menu.Target>
				<Group spacing="xs" align="center">
					<Badge
						color="red"
						variant="dot"
						size="lg"
						sx={() => ({
							animation: `${shake} 1s ease infinite`,
						})}
						style={{ marginLeft: '10px', cursor: 'pointer' }}
					>
						{user?.unratedConsultation?.length}
					</Badge>
					<Text color="gray.0" size="sm" align="center">
						{t('tr.feedback').toUpperCase()}
					</Text>
				</Group>
			</Menu.Target>
			<Menu.Dropdown
				p="xs"
				sx={(t) => ({
					width: '450px',
					maxHeight: '300px',
					overflowY: 'scroll',
					'::-webkit-scrollbar': {
						width: '1px',
					},
					'::-webkit-scrollbar-track': {
						background:
							t.colorScheme === 'dark' ? t.colors.dark[4] : t.colors.gray[2],
					},
					'::-webkit-scrollbar-thumb': {
						background:
							t.colorScheme === 'dark' ? t.colors.dark[6] : t.colors.gray[4],
					},
				})}
			>
				{hasUnratedConsultations ? (
					<UnratedConsultationNotifications
						consultations={user?.unratedConsultation}
						onClick={onModalOpen}
					/>
				) : (
					<Text>{t('tr.rate-your-doctor-visit-thanks')}</Text>
				)}
			</Menu.Dropdown>
		</Menu>
	) : null;
};
