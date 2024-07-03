import { useEffect , useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { getPrices } from '../api/index';

const usePrices = () => {
	const [loading, setLoading] = useState(false);
	const { data: prices, isLoading: loadingPrices } = useQuery({
        queryKey: ['getPrices'],
        ...getPrices,
		queryFn: getPrices,
    });

	useEffect(() => {
		if (loadingPrices) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [loadingPrices]);

	return { prices, loadingPrices, loading };
};

export default usePrices;
