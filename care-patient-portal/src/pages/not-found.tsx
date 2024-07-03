import { useTranslation } from 'react-i18next';
import {
	Anchor,
	BackgroundImage,
	Box,
	Button,
	Center,
	Text,
} from '@mantine/core';
import '../assets/styles/pages/notFound.css';
import { getPath } from './navigation';

export const NotFound = ({ err }: { err?: boolean }) => {
	const { t } = useTranslation(['default']);
	return (
		<Box
			sx={{ maxWidth: 900 }}
			mx="auto"
			mt="200px"
			className="notfound-container"
		>
			<BackgroundImage src="" radius="lg">
				<Center p="md">
					<Text color="black" align="center" className="notfound-text">
						{err ? (
							<>
								<h1 className="notfound-404">OOPS</h1>
								<h2 className="notfound-h2">Something went wrong!</h2>
								<p className="notfound-p">
									Please submit a support inquiry to report this error
								</p>
								<Anchor href={getPath('support')}>
									<Button mt={10}>Go to support</Button>
								</Anchor>
							</>
						) : (
							<>
								<h1 className="notfound-404">404</h1>

								<h2 className="notfound-h2">{t('tr.page-not-found')}</h2>

								<p className="notfound-p">
									{t('tr.page-not-found-description')}
								</p>
								<Anchor href={getPath('home')}>
									<Button mt={10}>{t('tr.go-back-to-home-page')}</Button>
								</Anchor>
							</>
						)}
					</Text>
				</Center>
			</BackgroundImage>
		</Box>
	);
};
