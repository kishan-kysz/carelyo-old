import { Link } from 'react-router-dom';
import styles from '../assets/styles/components/infotext.module.css';
import { AvailableRoutes, getPath } from '../pages/navigation';

const InfoText = ({
	text,
	path,
	description,
}: {
	text: string;
	path: AvailableRoutes;
	description: string;
}) => {
	const styleObj = {
		fontSize: 13.5,
	};
	return (
		<div className={styles['c-information']}>
			<p style={styleObj}>
				<Link className={styles['c-link-color']} to={getPath(path)}>
					{description}
				</Link>{' '}
				{text}
			</p>
		</div>
	);
};

export default InfoText;
