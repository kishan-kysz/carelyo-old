import {
	createStyles,
	Group,
	Image,
	Menu,
	UnstyledButton
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import i18n, { t } from 'i18next';
import { Fragment, useEffect, useState } from 'react';
import styles from '../../assets/styles/layout/navbar.module.css';
import HamburgerMenu from '../core/hamburger-menu';
import useProfile from '../../hooks/use-profile';
import languages, { ILanguages } from '../../constants/languages';
import WaitingRoomIndicator from './waiting-room-indicator';
import { useGuardedNavigation } from '../../pages/navigation';
import { HasUnratedConsultations } from '../profile/unrated-consultations';
import { useFeedback } from '../../pages/booking/feedback';
import { notifications } from '@mantine/notifications';

const Navbar = () => {
	const [providerName, setProviderName] = useState<string>('');
	const isMobile = window.innerWidth <= 600;

	useEffect(() => {
		const providerNameFromEnv = import.meta.env.VITE_PROVIDER_NAME;
		setProviderName(providerNameFromEnv || 'Default Provider Name');
	}, []);

	const { navigate } = useGuardedNavigation();
	const { user, updateLocal } = useProfile();
	const [opened, setOpened] = useState(false);
	const { classes } = useStyles({ opened });
	const { FeedbackModal, open } = useFeedback();

	const currentLanguage = i18n.language;
	const currentLanguageObject = languages.find(
		(language) => language.value.toLowerCase() === currentLanguage.toLowerCase()
	);
	const [flagOfLanguage, setFlagOfLanguage] = useState(
		currentLanguageObject?.iconFlag
	);
	const handleLanguageChange = async (l: ILanguages) => {
		if (!user) {
			return;
		}
		await updateLocal({
			...user,
			locale: {
				...user.locale,
				preferredLanguage: l.value,
			},
		});
		setFlagOfLanguage(l.iconFlag);
		i18n.changeLanguage(l.value).then((r) => r);
	};

	useEffect(() => {
		i18n.changeLanguage(user?.locale?.preferredLanguage).then((r) => r);
		const lang = languages.find(
			(l) => l.value === user?.locale?.preferredLanguage
		);
		if (lang) {
			setFlagOfLanguage(lang.iconFlag);
		} else {
			return;
		}
	}, [user]);
	useEffect(() => {
		let timer: NodeJS.Timeout | undefined;
		if (user?.unratedConsultation && user?.unratedConsultation.length > 0) {
			timer = setTimeout(() => {
				notifications.show({
					id: 'feedback-notification',
					title: t('tr.reminder'),
					message: t('tr.unrated-consultations'),
					color: t('tr.yellow'),
				});
			}, 5_000);
		}
		if (
			timer &&
			user?.unratedConsultation &&
			user?.unratedConsultation.length === 0
		) {
			clearTimeout(timer);
		}
		return () => clearTimeout(timer);
	}, [user?.unratedConsultation]);
	return (
		<Fragment>
			<div className={styles['l-navbar-container']}>
				<div className={`${styles['l-navbar']} ${styles.fixed}`}>
					<div className={styles.navbar}>
						<span
							className={styles['l-navbar-logo']}
							onClick={() => navigate('home')}
							onKeyDown={(e) => {
								if (e.key === 'Enter') navigate('home');
							}}
							style={{
								fontSize: isMobile ? '24px' : '24px',
								marginRight: isMobile ? '10px' : '0',
								whiteSpace: 'nowrap',
								// overflow: 'hidden',
							}}
						>
							{isMobile && providerName.includes(' ')
								? providerName.split(' ').map((word, index) => (
										<Fragment key={index}>
											{word}
											<br />
										</Fragment>
								  ))
								: providerName}
						</span>

						<div className={styles['l-navbar-menu']}>
							<span style={{ marginLeft: '10px', marginRight: '10px' }}>
								<HasUnratedConsultations handleOpen={open} />
							</span>

							<span style={{ marginLeft: '10px', marginRight: '10px' }}>
								<Menu
									onOpen={() => setOpened(true)}
									onClose={() => setOpened(false)}
									radius="md"
								>
									<Menu.Target>
										<UnstyledButton className={classes.control}>
											<Group spacing="xs">
												<Image src={flagOfLanguage} width={22} height={22} />
												{!isMobile && (
													<span className={classes.label}>
														{currentLanguage}
													</span>
												)}
											</Group>
											<IconChevronDown
												size={16}
												className={classes.icon}
												stroke={1.5}
											/>
										</UnstyledButton>
									</Menu.Target>
									<Menu.Dropdown>
										{languages.map((l) => (
											<Menu.Item
												key={l.value}
												icon={<Image src={l.iconFlag} width={18} height={18} />}
												defaultValue={l.value}
												onClick={() => handleLanguageChange(l)}
												onKeyDown={() => handleLanguageChange(l)}
											>
												{l.title}
											</Menu.Item>
										))}
									</Menu.Dropdown>
								</Menu>
							</span>
							<HamburgerMenu />
						</div>
					</div>
				</div>
			</div>
			{user?.activeConsultation?.id ? (
				<WaitingRoomIndicator id={user?.activeConsultation?.id} />
			) : null}
			<FeedbackModal />
		</Fragment>
	);
};

export default Navbar;

const useStyles = createStyles((theme, { opened }: { opened: boolean }) => ({
	control: {
		padding: '2px 5px',
		display: 'flex',
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		transition: 'background-color 150ms ease',
		borderRadius: theme.radius.sm,
		cursor: 'pointer',
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark'
					? theme.colors.dark[5]
					: theme.colors.gray[1],
		},
	},
	label: {
		fontWeight: 700,
		fontSize: theme.fontSizes.sm,
	},
	icon: {
		marginLeft: '2px',
		transition: 'transform 150ms ease',
		transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
		fontSize: theme.fontSizes.sm,
		fontWeight: 700,
	},
}));
