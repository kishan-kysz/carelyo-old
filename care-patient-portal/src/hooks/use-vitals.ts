import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { routes } from '../api/routes';

const useVitals = () => {
	const queryClient = useQueryClient();
	const { isLoading, data, isError } = useQuery(
		['getVitals'],
		routes.getVitals,
		{}
	);
	const {
		mutateAsync: addVitals,
		isLoading: bloodLoading,
		error,
	} = useMutation(routes.updateVitalDetails, {
		onSuccess() {
			void queryClient.invalidateQueries(['getVitals']);
		},
	});

	return {
		isLoading,
		isError,
		vitals: data,
		addVitals,
		bloodLoading,
		error,
	};
};

export default useVitals;
