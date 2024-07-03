import { useEffect , useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { getPrice } from '../api/index';

const usePrice = (name: string) => {
	const [loading, setLoading] = useState(false);
	const { data: price, isLoading: loadingPrice } = useQuery({
        queryKey: ['getPrice', name],
        queryFn: () => getPrice(name)
    });

	useEffect(() => {
		if (loadingPrice) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [price, loadingPrice]);

	return { price, loadingPrice, loading };
};

export default usePrice;
