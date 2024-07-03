import { useEffect , useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { getProviders } from '../api/index';

const useProviders = () => {
	const [loading, setLoading] = useState(false);
	const { data: providers, isLoading: loadingProviders } = useQuery({
        queryKey: ['getProviders'],
        ...getProviders,
		  queryFn: getProviders, 
    });

	useEffect(() => {
		if (loadingProviders) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [loadingProviders]);

	return { providers, loadingProviders, loading };
};

export default useProviders;
