import { useEffect , useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { getPrescription } from '../api/index';

const usePrescription = (prescriptionId: number) => {
	const [loading, setLoading] = useState(false);
	const { data: prescription, isLoading: loadingPrescription } = useQuery({
        queryKey: ['getPrescription', prescriptionId],

        queryFn: () =>
            getPrescription(prescriptionId)
    });

	useEffect(() => {
		if (loadingPrescription) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [loadingPrescription]);

	return { prescription, loadingPrescription, loading };
};

export default usePrescription;
