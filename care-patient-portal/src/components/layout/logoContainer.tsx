import React from 'react';
import styles from '../../assets/styles/components/logoContainer.module.css';
import { Title, Text, Box } from '@mantine/core';
import mantineConfig from '../../assets/styles/config/mantine.config.json';

interface LogoContainerProps {
	providerName: string;
	color: string;
}

const LogoContainer: React.FC<LogoContainerProps> = ({
	providerName,
	color,
}) => {
	return (
		<Box className={styles.logoContainer}>
			<Title order={3} style={{ fontFamily: mantineConfig.mantine.global.fontFamily}} color={mantineConfig.mantine.title.color} size={mantineConfig.mantine.title.fontSize} weight={mantineConfig.mantine.title.fontWeight}>
				{providerName}
			</Title>
			<Text className={styles.poweredText} style={{ fontFamily: mantineConfig.mantine.global.fontFamily}} color={mantineConfig.mantine.text.color} size={mantineConfig.mantine.text.fontSize} weight={mantineConfig.mantine.text.fontWeight}>
				Powered by <label className={styles.carelyoLabel}>Carelyo</label>
			</Text>
		</Box>
	);
};

export default LogoContainer;
