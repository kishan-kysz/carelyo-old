import { useEffect , useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { getInquiriesByUserId } from '../api/index';

const useInquiriesByUserId = (userId: number, page?: number, size?: number) => {
	const [loading, setLoading] = useState(false);
	const { data: inquiries, isLoading: loadingInquiries } = useQuery({
        queryKey: ['getInquiriesByUserId', userId, page, size],

        queryFn: () =>
            getInquiriesByUserId(userId, page, size)
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

export default useInquiriesByUserId;
