import { useEffect , useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api';

export const useUser = (id: number) => {
	const [loading, setLoading] = useState(false);
const { data: user, isLoading: loadingUser } = useQuery({ queryKey: ['getUser', id], queryFn: () => getUser(id) });
	useEffect(() => {
		if (loadingUser) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [loadingUser]);

	return { user, loadingUser, loading };
};
