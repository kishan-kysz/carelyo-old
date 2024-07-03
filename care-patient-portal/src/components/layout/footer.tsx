import { Box } from '@mantine/core';
import { Link } from 'react-router-dom';
import styles from '../../assets/styles/components/infotext.module.css';
import { getPath } from '../../pages/navigation';
import { useTranslation } from 'react-i18next';
import React from 'react';

const Footer: React.FC = () => {
	const { t, ready } = useTranslation(['default']);
	if (!ready) {
		return null;
	}
	return (
		<Box
			sx={{
				width: '100%',
				textAlign: 'center',
				color: '#999',
				fontSize: '0.8rem',
				padding: '1rem',
				background: '#fff',
			}}
		>
			<div style={{ overflowY: 'auto', maxHeight: '100vh' }}>
				<p className={styles['footer-copywrite']}>
					&copy; 2024 Carelyo. {t('all-rights-reserved')}
				</p>
				<p className={styles['footer-terms-link']}>
					<Link
						className={styles['d-link-color']}
						to={getPath('termsConditions')}
					>
						{t('terms-of-service')}
					</Link>{' '}
					|{' '}
					<Link className={styles['d-link-color']} to={getPath('cookies')}>
						{t('cookies-policy')}
					</Link>{' '}
					|{' '}
					<Link className={styles['d-link-color']} to={getPath('privacy')}>
						{t('privacy-policy')}
					</Link>
				</p>
			</div>
		</Box>
	);
};

export default Footer;
