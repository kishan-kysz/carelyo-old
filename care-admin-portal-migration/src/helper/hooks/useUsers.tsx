import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api/index';

const useUsers = () => {
	const [loading, setLoading] = useState(false);
	const { data: users, isLoading: loadingUsers } = useQuery({
  queryKey: ['getUsers'],
  queryFn: getUsers, 
});
	useEffect(() => {
		if (loadingUsers) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [loadingUsers]);

	return { users, loadingUsers, loading };
};

export default useUsers;
