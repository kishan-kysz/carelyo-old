import { Fragment } from 'react';
import { useParams } from 'react-router-dom';
import Container from '../../components/layout/container';
import PrescriptionItem from '../../components/summary/prescription-item';
import { formatUrlParamsToNumber } from '../../utils';

export const Prescription = () => {
	const { consultationId, id } = useParams();

	return (
		<Fragment>
			<Container sx={{ flex: '1', justifyContent: 'flex-start' }}>
				<PrescriptionItem
					consultationId={formatUrlParamsToNumber(consultationId)}
					individualPrescriptionId={formatUrlParamsToNumber(id)}
				/>
			</Container>
		</Fragment>
	);
};
