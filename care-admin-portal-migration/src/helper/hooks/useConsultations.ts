import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllConsultations } from '../api/index';

export const useConsultations = () => {
	const [loading, setLoading] = useState(false);
  const { data: consultations, isLoading: loadingConsultations } = useQuery({
  queryKey: ['getAllConsultations'],
    queryFn: getAllConsultations
  });

	useEffect(() => {
		if (loadingConsultations) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [loadingConsultations]);

	return { consultations, loadingConsultations, loading };
};
