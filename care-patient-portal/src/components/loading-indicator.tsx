import { Loader } from '@mantine/core';
import Container from './layout/container';
import { ReactNode } from 'react';

const LoadingIndicator = ({ children }: { children?: ReactNode }) => {
	return (
		<Container sx={{ margin: '10rem auto' }}>
			{children}
			<Loader sx={{ margin: 'auto' }} />
		</Container>
	);
};

export default LoadingIndicator;
