import { Fragment } from 'react';
import Container from '../../components/layout/container';
import PrescriptionList from '../../components/summary/prescription-list';

export const Prescriptions = () => {
	return (
		<Fragment>
			<Container sx={{ flex: '1', justifyContent: 'flex-start' }}>
				<PrescriptionList />
			</Container>
		</Fragment>
	);
};
