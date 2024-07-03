import { useEffect , useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { getAllSupportTickets } from '../api/index';

const useGetTickets = (page: number, size: number) => {
	const [loading, setLoading] = useState(false);
	const { data: tickets, isLoading: loadingTicket } = useQuery({
        queryKey: ['getAllSupportTickets', page, size],

        queryFn: () =>
            getAllSupportTickets(page, size)
    });

	useEffect(() => {
		if (loadingTicket) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [tickets, loadingTicket]);

	return { tickets, loading };
};

export default useGetTickets;
