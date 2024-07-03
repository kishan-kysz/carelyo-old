import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInquiriesByQuery } from '../api/index';

export const useInquiriesByQuery = (query: string) => {
	const [loading, setLoading] = useState(false);
	const { data: inquiries, isLoading: loadingInquiries } = useQuery({
        queryKey: ['getInquiriesByQuery', query],

        queryFn: () =>
            getInquiriesByQuery({ query })
    });

	useEffect(() => {
		if (loadingInquiries) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [loadingInquiries]);

	return { inquiries, loadingInquiries, loading };
};
