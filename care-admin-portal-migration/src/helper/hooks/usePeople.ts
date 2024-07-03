import { useEffect , useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { getAllDoctors, getAllPatients, getFullPatientProfile } from '../api/index';

const usePeople = () => {
	const [loading, setLoading] = useState(false);
  const { data: doctors, isLoading: loadingDoctors } = useQuery({
    queryKey: ['getAllDoctors'], 
    queryFn: getAllDoctors
  });
  const { data: patients, isLoading: loadingPatients } = useQuery({
    queryKey: ['getAllPatients'],
    queryFn: getAllPatients
  });
const { data: fullPatientProfile, isLoading: loadingFullPatientProfile } = useQuery({
    queryKey: ['getFullPatientProfile'],
    queryFn: getFullPatientProfile
  });
	useEffect(() => {
		if (loadingDoctors || loadingPatients || loadingFullPatientProfile) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [loadingDoctors, loadingPatients, loadingFullPatientProfile]);

	return { doctors, patients, fullPatientProfile, loadingDoctors, loadingFullPatientProfile, loadingPatients, loading };
};

export default usePeople;
