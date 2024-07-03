import { routes } from '../api/routes';
import { useQuery } from '@tanstack/react-query';

const useSummary = () => {
	const { data, isLoading } = useQuery(['getSummaries'], routes.getSummaries);

	const getSummaryById = (id?: number) =>
		useQuery(['getConsultationSummaryById', id], () => routes.getSummary(id), {
			enabled: !!id,
		});
	const getPrescriptionById = (id?: number) =>
		useQuery(
			['getPrescriptions', id],
			() => routes.getPrescriptionsByConsultation(id),
			{
				enabled: !!id,
			}
		);
	const getLabRequestsById = (id?: number) =>
		useQuery(['getLabresult', id], () => routes.getLabResults(id), {
			enabled: !!id,
		});
/*	const getReceiptById = (id?: number) =>
		useQuery(['getReceiptById', id], () => routes.getReceipt, {
			enabled: !!id,
		});
	const getFollowUpById = (id?: number) =>
		useQuery(['getFollowUpById', id], () => routes.getFollowUp, {
			enabled: !!id,
		});*/

	return {
		summaries: data?.sort(
			(a, b) =>
				new Date(b.timeFinished).getMilliseconds() -
				new Date(a.timeFinished).getMilliseconds()
		),
		loading: isLoading,
		getPrescriptionById,
		getSummaryById,
		getLabRequestsById,
	};
};

export default useSummary;
