import { useEffect, useLayoutEffect } from 'react';
import LoadingIndicator from '../../loading-indicator';
import { Title } from '@mantine/core';
import { useGuardedNavigation } from '../../../pages/navigation';

const WalletPayment: React.FC<{
	setVerify: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setVerify }) => {
	const { navigate } = useGuardedNavigation();

	useEffect(() => {
		setVerify(true);
		// navigate('waitingroom');
	}, []);

	return (
		<center>
			<LoadingIndicator>
				<Title order={3} color="dimmed" my="md">
					Verifying wallet balance..
				</Title>
			</LoadingIndicator>
		</center>
	);
};

export default WalletPayment;
