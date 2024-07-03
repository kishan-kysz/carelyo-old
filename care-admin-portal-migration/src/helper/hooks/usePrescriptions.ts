import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllPrescriptions } from '../api/index';

export const usePrescriptions = () => {
	const [loading, setLoading] = useState(false);
	const { data: prescriptions, isLoading: loadingPrescriptions } = useQuery({
        queryKey: ['getAllPrescriptions'],
        ...getAllPrescriptions,
		  queryFn: getAllPrescriptions, 
    });

	useEffect(() => {
		if (loadingPrescriptions) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [loadingPrescriptions]);

	return { prescriptions, loadingPrescriptions, loading };
};
