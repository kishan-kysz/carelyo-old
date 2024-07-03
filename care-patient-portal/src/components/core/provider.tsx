import { Anchor, Button, Card, Center, Image, Stack, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useProvider from '../../hooks/use-provider';
import LoadingIndicator from '../loading-indicator';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
import { getPath } from '../../pages/navigation';

const Provider = () => {
	const { t } = useTranslation(['default']);
	const { provider, loading } = useProvider();

	return provider ? (
		<Stack mt="md">
			<Center>
				<Card shadow="sm" p="xl" radius="md" w="500">
					<>
						<Card.Section>
							<Image
								src={provider.logoURL}
								height={350}
								alt="provider logo"
								withPlaceholder={true}
							/>
						</Card.Section>
						<Text
							ta="center"
							mt="md"
							mb="md"
							color={mantineConfig.mantine.title.color}
							style={{
								fontFamily: mantineConfig.mantine.global.fontFamily,
								fontSize: mantineConfig.mantine.text.label.title.fontSize,
							}}
							w={mantineConfig.mantine.text.label.title.fontWeight}
						>
							{provider.providerName}
						</Text>
						<Text
							ta="center"
							fw={500}
							fz={16}
							color={mantineConfig.mantine.text.label.title.color}
							style={{
								fontFamily: mantineConfig.mantine.global.fontFamily,
								fontSize: mantineConfig.mantine.text.label.fontSize,
							}}
							w={mantineConfig.mantine.text.label.fontWeight}
						>
							{provider.address}
						</Text>
						<Link to={provider?.webPageUrl} rel="noreferrer" target="_blank">
							<Button
								disabled={!provider.webPageUrl}
								color={mantineConfig.mantine.button.disabled.backgroundColor}
								style={{
									color: mantineConfig.mantine.button.fontColor,
								}}
								fullWidth={true}
								mt="md"
								radius="md"
							>
								{t('tr.show-more-info')}
							</Button>
						</Link>
					</>
				</Card>
			</Center>
			<Text
				color="{mantineConfig.mantine.text.color}"
				weight={mantineConfig.mantine.text.href.fontWeight}
				style={{
					fontFamily: mantineConfig.mantine.global.fontFamily,
					fontSize: mantineConfig.mantine.text.href.fontSize,
				}}
				align="center"
			>
				{t('tr.contact-provider')}
				<Anchor
					color={mantineConfig.mantine.text.href.color}
					style={{
						fontFamily: mantineConfig.mantine.global.fontFamily,
						fontSize: mantineConfig.mantine.text.href.fontSize,
					}}
					weight={mantineConfig.mantine.text.href.fontWeight}
					href={getPath('support')}
				>
					{' '}
					{t('tr.support')}
				</Anchor>{' '}
				{t('tr.team')}{' '}
			</Text>
		</Stack>
	) : loading ? (
		<LoadingIndicator />
	) : (
		<Text
			ta="center"
			mt="xl"
			mb="md"
			size={mantineConfig.mantine.text.fontSize}
			color={mantineConfig.mantine.text.color}
			style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
		>
			{t('tr.no-provider-selected')}
		</Text>
	);
};

export default Provider;
