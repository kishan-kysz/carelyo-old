import { getLabRequests } from './../api/index';
import { useEffect , useState } from 'react';

import { useQuery } from '@tanstack/react-query';

const usePrices = () => {
	const [loading, setLoading] = useState(false);
	const { data: labRequests, isLoading: loadingLabRequests } = useQuery({
        queryKey: ['getLabRequests'],
        ...getLabRequests,
		queryFn: getLabRequests,
    });

	useEffect(() => {
		if (loadingLabRequests) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [loadingLabRequests]);

	return { labRequests, loadingLabRequests, loading };
};

export default usePrices;
