import { useEffect , useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { getPatient, getDoctor, getCompletePatientProfile } from '../api/index';

const usePerson = (userId: number) => {
	const [loading, setLoading] = useState(false);
	const { data: patient, isLoading: loadingPatient } = useQuery({
        queryKey: ['getPatient', userId],
        queryFn: () => getPatient(userId)
    });
	const { data: doctor, isLoading: loadingDoctor } = useQuery({
        queryKey: ['getDoctor', userId],
        queryFn: () => getDoctor(userId)
    });
	const { data: completedPatientProfile, isLoading: loadingCompletedPatientProfile } = useQuery({
        queryKey: ['getCompletePatientProfile', userId],
        queryFn: () => getCompletePatientProfile(userId)
    });
	useEffect(() => {
		if (loadingPatient || loadingDoctor || loadingCompletedPatientProfile) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [loadingPatient, loadingDoctor, loadingCompletedPatientProfile]);

	return {
		patient,
		loadingPatient,
		doctor,
		loadingDoctor,
		completedPatientProfile,
		loadingCompletedPatientProfile,
		loading
	};
};

export default usePerson;
