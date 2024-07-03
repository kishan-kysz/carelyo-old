import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInquiryById , updateInquiryStatus } from '../api/index';


const useInquiry = (id: number) => {
	const queryClient = useQueryClient();
	const [loading, setLoading] = useState(false);

	const { data: inquiry, isLoading: loadingInquiry } = useQuery({
        queryKey: ['getInquiryById', id],
        queryFn: () => getInquiryById({ id })
    });

	const { mutateAsync: updateStatus, isLoading: loadingStatus } = useMutation(
		({ id, status }: { id: number; status: string }) => updateInquiryStatus({ id, status }),
		{
			onSuccess: ({ id }) => {
				queryClient.invalidateQueries({ queryKey: ['getInquiryById', id] });
				queryClient.invalidateQueries({ queryKey: ['getAllInquiries'] });
			},
			onError: (err) => {
				console.log(err);
			}
		}
	);

	useEffect(() => {
		if (loadingInquiry || loadingStatus) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [loadingInquiry, loadingStatus]);

	return { inquiry, updateStatus, loadingInquiry, loadingStatus, loading };
};

export default useInquiry;
