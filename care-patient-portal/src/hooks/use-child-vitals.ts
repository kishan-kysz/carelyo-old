import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { routes } from '../api/routes';
import { IChildrenResponse } from '../api/types';

const useChildVitals = (child: IChildrenResponse) => {
	const queryClient = useQueryClient();
	const { isLoading, data, isError } = useQuery(
		['getChildVitals', child.childId],
		() => routes.getChildVitals(child.childId), // Wrap in arrow function
		{}
	);
	const {
		mutateAsync: addChildVitals,
		isLoading: bloodLoading,
		error,
	} = useMutation(routes.updateVitalDetails, {
		onSuccess() {
			void queryClient.invalidateQueries(['getChildVitals']);
		},
	});
	return {
		isLoading,
		isError,
		childVitals: data,
		addChildVitals,
		bloodLoading,
		error,
	};
};

export default useChildVitals;
