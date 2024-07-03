import { IGetPayrollResponse } from './../utils/types';
import { useEffect , useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { getPayroll, getPayrollHistory } from '../api/index';

export const usePayroll = () => {
	const [loading, setLoading] = useState(false);
	const [payroll, setPayroll] = useState<IGetPayrollResponse[]>();
	const { data: payrollCurrent, isLoading: loadingPayroll } = useQuery({
        queryKey: ['getPayrollCurrent'],
        ...getPayroll,
		queryFn: getPayroll,
    });
	const { data: payrollHistory, isLoading: loadingPayrollHistory } = useQuery({
        queryKey: ['getPayrollHistory'],
        ...getPayrollHistory,
		queryFn: getPayrollHistory,
    });

	useEffect(() => {
		if (loadingPayroll || loadingPayrollHistory) {
			setLoading(true);
		} else {
			setLoading(false);
		}

		if (!(loadingPayroll || loadingPayrollHistory)) {
			if (payrollCurrent !== undefined && payrollHistory !== undefined) {
				setPayroll([]);
				setPayroll(payrollCurrent.concat(payrollHistory));
			}
		}
	}, [loadingPayroll, loadingPayrollHistory, payrollCurrent, payrollHistory]);

	return { payrollCurrent, loadingPayroll, payrollHistory, loadingPayrollHistory, payroll, loading };
};
