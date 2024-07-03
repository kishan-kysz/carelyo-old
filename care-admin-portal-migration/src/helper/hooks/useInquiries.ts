import { useEffect , useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { getAllInquiries } from '../api/index';

const useInquiries = (page: number, size: number) => {
	const [loading, setLoading] = useState(false);
	const { data: inquiries, isLoading: loadingInquiries } = useQuery({
        queryKey: ['getAllInquiries', page, size],

     queryFn: () => getAllInquiries(page, size),
    });

	useEffect(() => {
		if (loadingInquiries) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [loadingInquiries]);

	return { inquiries, loading };
};

export default useInquiries;
