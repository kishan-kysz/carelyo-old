import React, { Fragment } from 'react';
import { Flex, Title } from '@mantine/core'; // Import necessary components from Material-UI
import styles from '../../assets/styles/layout/navbar.module.css';

interface PoweredByProps {
	isMobile: boolean; // Define isMobile as a boolean type
}

const PoweredBy: React.FC<PoweredByProps> = ({ isMobile }) => {
	return (
		<Fragment>
			<div className={styles['l-navbar-container']}>
				<Title
					size="xl"
					mb="xl"
					color="teal.7"
					align="center"
					order={3}
					style={{ textAlign: 'center' }} // Center-align text
				>
					<p style={{ fontSize: '10px', marginBottom: '-1em' }}>Powered by</p>
					<p
						style={{
							fontSize: isMobile ? '24px' : '40px',
							fontWeight: 700,
						}}
					>
						{' '}
						{/* Conditionally set font size */}
						Carelyo
						<span
							style={{
								position: 'relative',
								top: '-0.9em',
								fontSize: isMobile ? '14px' : '22px', // Conditionally set font size for subtext
							}}
						>
							<sub>&#174;</sub>
						</span>
					</p>
				</Title>
			</div>
		</Fragment>
	);
};

export default PoweredBy;
