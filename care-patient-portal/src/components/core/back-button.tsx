import { ActionIcon, Tooltip } from '@mantine/core';
import { Fragment } from 'react';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGuardedNavigation } from '../../pages/navigation';
import '../../assets/styles/components/back-button.css';


const BackButton = () => {
	const { t } = useTranslation(['default']);
	const history = useLocation();
	const { back } = useGuardedNavigation();
	return (
		<Fragment>
			{history.pathname !== '/' && (
				<Tooltip label={t('tr.back')} position="right">
					<ActionIcon className="back-btn" size="lg" onClick={back}>
						<BsArrowLeftCircle size={28} color="white" />
					</ActionIcon>
				</Tooltip>
			)}
		</Fragment>
	);
};

export default BackButton;
