import {
	Box,
	Flex,
	Image,
	Stack,
	Title,
	UnstyledButton,
	px,
} from '@mantine/core';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';
import Style from '../../assets/styles/components/infotext.module.css';
import { type ReactNode } from 'react';
import { getPath } from '../../pages/navigation';
import { useFeedback } from '../../pages/booking/feedback';
import { NewVersion } from '../new-version';
import { t } from 'i18next';
import PoweredBy from '../layout/poweredby';

const Layout = ({ children }: { children: ReactNode }) => {
	const navigate = useNavigate();
	const { FeedbackModal } = useFeedback();
	const isMobile = window.innerWidth <= 600;

	return (
		<Stack spacing={0} sx={{ position: 'relative', minHeight: '100vh' }}>
			<Navbar />
			<Box
				sx={(theme) => ({
					backgroundColor: theme.fn.lighten(theme.colors.gray[1], 0.8),
					padding: theme.spacing.sm,
					minHeight: 'calc(90vh - 150px)',
					overflow: 'auto',
					paddingBottom: '40px',
				})}
			>
				<NewVersion />
				{children}
			</Box>

			<UnstyledButton
				color="teal"
				className={Style['feedback']}
				onClick={() => {
					navigate(getPath('feedback'));
				}}
			>
				{t('tr.feedback').toUpperCase()}
			</UnstyledButton>
			<FeedbackModal />

			<PoweredBy isMobile={false} />
		</Stack>
	);
};

export default Layout;
