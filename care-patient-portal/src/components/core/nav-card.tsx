import { Button, Card, createStyles, Group, Title } from '@mantine/core';
import { IconArrowBarRight } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import Styles from '../../assets/styles/pages/home.module.css';
import { AvailableRoutes, getPath } from '../../pages/navigation';
import mantineConfig from '../../assets/styles/config/mantine.config.json';

export default function NavCard({
	image,
	title,
	path,
	onClick,
}: {
	image: string;
	title: string;
	path?: AvailableRoutes;
	onClick?: () => void;
}) {
	const navigate = useNavigate();
	const { classes } = useStyles();
	const handleClick = () => {
		if (!(path || onClick)) {
			return;
		}
		if (path) {
			navigate(getPath(path));
		}
		if (onClick) {
			onClick();
		}
	};
	return (
		<Card
			className={classes.card}
			shadow="sm"
			withBorder={true}
			radius="md"
			p="md"
			onClick={handleClick}
		>
			<Card.Section className={Styles['background']}>
				<img
					src={image}
					alt="doctor"
					height={225}
					className={Styles['imgbox']}
				/>
			</Card.Section>
			<Group mt="sm">
				<Button
					color="dark.9"
					rightIcon={<IconArrowBarRight size={mantineConfig.mantine.text.label.title.icon.size} />}
					variant="white"
					uppercase={true}
					size="md"
					radius="md"
					style={{ flex: 1, padding: 2, width: 140 }}
				>
					<Title color={mantineConfig.mantine.text.label.color} style={{
  fontFamily: mantineConfig.mantine.global.fontFamily,
 fontSize: mantineConfig.mantine.text.label.fontSize}} >{title}</Title>
				</Button>
			</Group>
		</Card>
	);
}

const useStyles = createStyles((theme) => ({
	card: {
		position: 'relative',
		cursor: 'pointer',
		overflow: 'hidden',
		transition: 'transform 200ms ease, box-shadow 100ms ease',
		padding: theme.spacing.xl,
		paddingLeft: theme.spacing.xl, // TODO: Originally * 2

		'&:hover': {
			boxShadow: theme.shadows.md,
			transform: 'scale(1.02)',
			'&::before': {
				content: '""',
				position: 'absolute',
				top: 0,
				bottom: 0,
				left: 0,
				width: 7,
				backgroundImage: theme.fn.linearGradient(
					2,
					theme.colors.teal[9],
					theme.colors.teal[5]
				),
			},
		},
	},
}));
