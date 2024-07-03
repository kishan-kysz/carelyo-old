import { useEffect , useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { getTemplate } from '../api/index';

export const useGetTemplate = (type: string) => {
	const [loading, setLoading] = useState(false);
	const { data: template, isLoading: loadingTemplate } = useQuery({
        queryKey: ['getTemplate', type],
        queryFn: () => getTemplate({ type })
    });

	useEffect(() => {
		if (loadingTemplate) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [loadingTemplate]);

	return { template, loadingTemplate, loading };
};
