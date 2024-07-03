import { useQuery } from '@tanstack/react-query';
import { routes } from '../api/routes';
import { useEffect, useState } from 'react';

const useProvider = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);

	const {
		data: provider,
		isLoading: loadingProvider,
		isError: errorProvider,
	} = useQuery(['getProvider'], routes.getProvider);

	const {
		data: providers,
		isLoading: loadingProviders,
		isError: errorProviders,
	} = useQuery(['getProviders'], routes.getProviders);

	useEffect(() => {
		if (loadingProvider || loadingProviders) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [loadingProvider, loadingProviders]);

	useEffect(() => {
		if (errorProvider || errorProviders) {
			setError(true);
		} else {
			setError(false);
		}
	}, [errorProvider, errorProviders]);

	return {
		loading,
		error,
		provider,
		providers,
	};
};

export default useProvider;
