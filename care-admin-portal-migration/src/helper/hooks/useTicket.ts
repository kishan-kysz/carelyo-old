import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTicketById } from '../api/index';

const useTicket = (entryId: number) => {
	const [loading, setLoading] = useState(false);
	const { data: ticket, isLoading: loadingTicket } = useQuery({
        queryKey: ['getTicketById', entryId],
        queryFn: () => getTicketById(entryId)
    });

	useEffect(() => {
		if (loadingTicket) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [ticket, loadingTicket]);

	return { ticket, loading };
};

export default useTicket;
