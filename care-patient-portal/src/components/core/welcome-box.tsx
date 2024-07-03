import { Flex, Avatar, Title} from '@mantine/core';
import styles from '../../assets/styles/components/welcomebox.module.css';
import useProfile from '../../hooks/use-profile';
import { useGuardedNavigation } from '../../pages/navigation';
import { formatName, greetUser, initials } from '../../utils';
import { getDicebearProfileInititals } from '../../utils/integration/dicebear';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
import Cookies from 'js-cookie';

const WelcomeBox = () => {
	const { user } = useProfile();
	const { navigate } = useGuardedNavigation();
	const userInitials = initials({
		firstName: user?.firstName || 'C', // Provide a default value or fallback
		surName: user?.surName || 'C', // Provide a default value or fallback
	});
	const profilePhoto =  Cookies.get('profilePhoto') == null ? getDicebearProfileInititals(
		initials({
			firstName: user?.firstName || '',
			surName: user?.surName || '',
		})
	) || '' : Cookies.get('profilePhoto');
	
	return (
		<div className={styles['c-welcome']}>
			<Flex direction="column">
				<div className={styles['c-welcome-profile']}>
					<Flex direction="column">
						<Title
							color={mantineConfig.mantine.title.heading.welcome.color}
							style={{
								fontFamily: mantineConfig.mantine.global.fontFamily,
								fontSize:
									mantineConfig.mantine.title.heading.subheading.fontSize,
							}}
							className={styles['c-welcome-tag']}
						>
							{greetUser()}{' '}
						</Title>
						<Title
							color={mantineConfig.mantine.title.heading.welcome.color}
							style={{
								fontFamily: mantineConfig.mantine.global.fontFamily,
								fontSize: mantineConfig.mantine.title.heading.fontSize,
							}}
							className={styles['c-welcome-name']}
						>
							{user?.profileComplete &&
								formatName({ title: user?.title, surName: user?.surName })}
						</Title>
					</Flex>
					<Flex gap="1rem" align="center">
						{user && (
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
								aria-label={userInitials || ''}
								onMouseOver={(e) => {
									e.currentTarget.title = userInitials || ''; // Set the title attribute to the alt text
								}}
								onMouseOut={(e) => {
									e.currentTarget.title = ''; // Clear the title attribute when mouse leaves the avatar
								}}
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.src = `data:image/svg+xml;base64,${btoa(
										getDicebearProfileInititals(
											initials({
												firstName: user?.firstName,
												surName: user?.surName,
											})
										)
									)}`;
								}}
							/>
						)}
					</Flex>
				</div>
			</Flex>
		</div>
	);
};

export default WelcomeBox;
