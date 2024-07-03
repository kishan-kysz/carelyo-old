import { useQuery } from '@tanstack/react-query';
import { routes } from '../api/routes';

const useConsultationPrice = (priceListName: string) => {
	const {
		data,
		isLoading: loading,
		isError: error,
	} = useQuery(['ConsultationPrice', priceListName], () =>
		routes.getConsultationPrice(priceListName)
	);

	return {
		priceList: data,
		loading,
		error,
	};
};
export default useConsultationPrice;
