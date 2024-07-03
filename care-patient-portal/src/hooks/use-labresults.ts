import { useQuery } from '@tanstack/react-query';
import { routes } from '../api/routes';

const useLabresults = (consultationId?: number) => {
	const {
		data: labResults,
		isInitialLoading: loading,
		isError: error,
	} = useQuery(
		['getLabResults', consultationId],
		() => routes.getLabResults(consultationId),
		{
			enabled: !!consultationId,
		}
	);

	return {
		labResults,
		loading,
		error,
	};
};

export default useLabresults;
