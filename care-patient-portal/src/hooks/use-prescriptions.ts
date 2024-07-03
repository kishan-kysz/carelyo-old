import { useQuery } from '@tanstack/react-query';
import { routes } from '../api/routes';

const usePrescriptions = () => {
	const { data, isLoading, error } = useQuery(
		['getPrescriptions'],
		routes.getPrescriptions
	);
	const getPrescriptionById = (id: number) =>
		useQuery(['getPrescriptions'], () => routes.getPrescription(id));
	return {
		prescriptions: data,
		prescriptionsError: error,
		prescriptionsLoading: isLoading,
		getPrescriptionById,
	};
};

export default usePrescriptions;
