import { useEffect , useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { getProvider } from '../api/index';

const useProvider = (providerId: number) => {
	const [loading, setLoading] = useState(false);
	const { data: provider, isLoading: loadingProvider } = useQuery({
        queryKey: ['getProvider', providerId],

        queryFn: () =>
            getProvider(providerId)
    });

	useEffect(() => {
		if (loadingProvider) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [loadingProvider]);

	return { provider, loadingProvider, loading };
};

export default useProvider;
