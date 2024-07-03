import {
	ActionIcon,
	Avatar,
	Box,
	Burger,
	createStyles,
	Drawer,
	Flex,
	Image,
	Stack,
	Title,
	UnstyledButton,
	useMantineTheme
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { logout } from '../../utils/auth';
import { Fragment, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getPath, useGuardedNavigation } from '../../pages/navigation';
import useProfile from '../../hooks/use-profile';
import { useDisclosure } from '@mantine/hooks';
import { IconDoorExit, IconX } from '@tabler/icons-react';
import logoGreen from '../../assets/Icons/header/logo-green.svg';
import Footer from '../layout/footer';
import { initials } from '../../utils';
import styles from '../../assets/styles/components/welcomebox.module.css';
import { getDicebearProfileInititals} from '../../utils/integration/dicebear';
import Cookies from 'js-cookie';
/*Todo
1. Add profile name and avatar to drawers header box
2. Add Carelyo logo to drawer bottom
3. Rework the logout button/make it look good
4. Remove footer and add the terms and conditions etc to the drawer.

*/

const HamburgerMenu = () => {
	const { user } = useProfile();
	const { navigate } = useGuardedNavigation();
	// const userInitials = initials({
	// 	firstName: user?.firstName || '', // Provide a default value or fallback
	// 	surName: user?.surName || '', // Provide a default value or fallback
	// });
	const [menu, { toggle, close }] = useDisclosure(false);
	const location = useLocation();
	const name = `${user?.firstName || ''} ${user?.surName || ''}`;
	const theme = useMantineTheme();

	const profilePhoto =  Cookies.get('profilePhoto') == null ? getDicebearProfileInititals(
		initials({
			firstName: user?.firstName || '',
			surName: user?.surName || '',
		})
	) || '' : Cookies.get('profilePhoto');
	const { classes } = useStyles();

	const handleLogout = async () => {
		sessionStorage.clear();
		logout();
	};
	

	useEffect(() => {
		close(); // Close drawer whenever we change a route
	}, [location]);
	const { t } = useTranslation(['default']);

	return (
		<Fragment>
			<Drawer
				withCloseButton={false}
				classNames={{
					content: classes.content,
					header: classes.content,
					body: classes.body,
				}}
				size="xs"
				color="teal"
				position="right"
				opened={menu}
				onClose={close}
			>
				<Flex h="100%" direction="column" justify="space-between">
					<Box>
						<Flex
							gap="md"
							direction="column"
							align="center"
							p={16}
							py={48}
							className={classes.profileWrapper}
						>
							<ActionIcon
								className={classes.closeButton}
								onClick={() => close()}
							>
								<IconX width={32} height={32} />
							</ActionIcon>
							{/* <Avatar radius="xl" size="xl" /> */}
							<Avatar
								onKeyDown={() => navigate('profile')}
								onClick={() => navigate('profile')}
								className={styles['c-welcome-avatar']}
								src={`${profilePhoto}`}
								alt={getDicebearProfileInititals(
									initials({
										firstName: user?.firstName || '',
										surName: user?.surName || '',
									})
								) || ''}
								aria-label={name || ''}
								onMouseOver={(e) => {
									e.currentTarget.title = name || '';
								}}
								onMouseOut={(e) => {
									e.currentTarget.title = '';
								}}
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.src = `data:image/svg+xml;base64,${btoa(
										getDicebearProfileInititals(
											initials({
												firstName: user?.firstName || '',
												surName: user?.surName || '',
											})
										)
									)}`;
								}}
							/>
							<Title fw={500} color="white" order={2}>
								{name}
							</Title>
						</Flex>
						<Stack spacing={0}>
							{location.pathname !== '/' && (
								<Link className={classes.link} to={getPath('home')}>
									{t('tr.home').toUpperCase()}
								</Link>
							)}
							<Link className={classes.link} to={getPath('messages')}>
								{t('tr.inbox').toUpperCase()}
							</Link>
							<Link className={classes.link} to={getPath('booking')}>
								{t('tr.see-a-doctor').toUpperCase()}
							</Link>
							<Link className={classes.link} to={getPath('services')}>
								{t('tr.service').toUpperCase()}
							</Link>
							<Link className={classes.link} to={getPath('profile')}>
								{t('tr.profile').toUpperCase()}
							</Link>
							<Link className={classes.link} to={getPath('support')}>
								{t('tr.support').toUpperCase()}
							</Link>

							<UnstyledButton
								sx={{ display: 'flex', gap: 8, alignItems: 'center' }}
								className={classes.link}
								w="100%"
								onClick={handleLogout}
							>
								{t('tr.logout').toUpperCase()}
								<IconDoorExit />
							</UnstyledButton>
						</Stack>
					</Box>

					<Flex direction="column" align="center">
						<Image maw={175} color="#000" src={logoGreen} alt="Carelyo logo" />
						<Title
							mb={theme.spacing.xl}
							color={theme.colors.teal[7]}
							align="center"
							order={3}
						>
							{t('tr.patient')}
						</Title>
						<Footer />
					</Flex>
				</Flex>
			</Drawer>
			<Burger onClick={toggle} opened={menu} color="#fff" />
		</Fragment>
	);
};

const useStyles = createStyles((theme) => ({
	link: {
		textDecoration: 'none',
		color: 'black',
		fontWeight: 700,
		textAlign: 'left',
		fontSize: theme.fontSizes.lg,
		padding: 16,
		transition: '.2s all ease',
		'&:hover': {
			background: theme.colors.teal[7],
			borderColor: theme.colors.teal[7],
			color: 'white',
		},
	},
	content: {
		background: 'rgba(252, 253, 253, 1)',
		position: 'relative',
	},
	body: {
		padding: 0,
		height: '100%',
	},
	btnWrap: {
		padding: '1rem',
	},
	profileWrapper: {
		background: theme.colors.teal[7],
	},
	closeButton: {
		position: 'absolute',
		color: 'white',
		cursor: 'pointer',
		top: 10,
		left: 10,
		'&:hover': {
			background: theme.colors.teal[8],
		},
		'&:focus-visible': {
			outlineColor: 'white',
		},
	},
}));
export default HamburgerMenu;
