import { useQuery } from '@tanstack/react-query';
import { routes } from '../api/routes';

// const useReceipt = (id: number) => {
// 	const { isLoading, data, isError } = useQuery(['getReceipt', id], () =>
// 		routes.getReceipt(id)
// 	);
// 	return {
// 		isLoading,
// 		isError,
// 		receipt: data,
// 	};
// };

const useReceipt = (id: number) => {
	const {
		isLoading: receiptLoading,
		data: receiptData,
		isError: receiptError,
	} = useQuery(['getReceipt', id], () => routes.getReceipt(id));

	const {
		isLoading: currencyLoading,
		data: currencyData,
		isError: currencyError,
	} = useQuery(['getProvider'], () => routes.getProvider());

	return {
		isLoading: receiptLoading || currencyLoading,
		isError: receiptError || currencyError,
		receipt: receiptData,
		currency: currencyData?.currency, // Assuming 'currency' is the field name in the currency data
	};
};

export default useReceipt;
