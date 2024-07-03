import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyTickets } from '../api/index';

const useMyTickets = (page: number, size: number) => {
	const [loading, setLoading] = useState(false);
	const { data: myTickets, isLoading: loadingMyTickets } = useQuery({
        queryKey: ['getMyTickets', page, size],

        queryFn: () =>
            getMyTickets(page, size)
    });

	useEffect(() => {
		if (loadingMyTickets) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [myTickets, loadingMyTickets]);

	return { myTickets, loadingMyTickets, loading };
};

export default useMyTickets;
