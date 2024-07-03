import SelectConsultation from '../../components/booking/select-child';
import useChildren from '../../hooks/use-children';
import Container from '../../components/layout/container';
import { StepperProps } from './index';
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { useGuardedNavigation } from '../navigation';
import { useTranslation } from 'react-i18next';

export const ChildConsultation = ({ nextStep, previousStep }: StepperProps) => {
	const { activeChildren } = useChildren();
	const { navigate } = useGuardedNavigation();
	const { t, ready } = useTranslation(['default'])
	return (
		<Container
			sx={{
				width: '80%',
				margin: '0 auto',
			}}
		>
			{activeChildren && activeChildren.length > 0 ? (
				<SelectConsultation
					data={activeChildren}
					nextStep={nextStep}
					previousStep={previousStep}
				/>
			) : (
				<Stack align="center">
					<Title>{t('tr.no-child-in-your-account')}</Title>
					<Text>{t('tr.you-can-add-a-child-in-your-profile')}</Text>
					<Group position="center">
						<Button onClick={() => navigate('profile')}>{t("tr.to-profile")}</Button>
					</Group>
				</Stack>
			)}
		</Container>
	);
};
