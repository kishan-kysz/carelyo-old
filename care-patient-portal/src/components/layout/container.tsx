import { Box, type Sx } from '@mantine/core';
import { type ReactNode } from 'react';

const Container = ({ children, sx }: { children: ReactNode; sx?: Sx }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				margin: '0 auto',
				alignItems: 'center',
				width: '100%',
				maxWidth: 1250,
				...sx,
			}}
		>
			{children}
		</Box>
	);
};

export default Container;
