import { useEffect , useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { getAllTemplates } from '../api/index';

export const useGetAllTemplates = () => {
	const [loading, setLoading] = useState(false);
	const { data: templates, isLoading: loadingTemplates } = useQuery({
        queryKey: ['getAllTemplates'],
    
		queryFn: getAllTemplates,
    });

	useEffect(() => {
		if (loadingTemplates) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [loadingTemplates]);

	return { templates, loadingTemplates, loading };
};
