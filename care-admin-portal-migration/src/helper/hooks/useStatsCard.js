import { useState, useEffect } from 'react';

const useStatsCard = ({ consultationsMetrics, amountPaidForConsultationsOverTimeMetrics, paddedMonth, endMonth }) => {
	const [consultationdifference, setConsultationDifference] = useState(null);
	const [revenueDifference, setRevenueDifference] = useState(null);
	const [consultationValueLastMonth, setConsultationValueLastMonth] = useState(0);
	const [consultationValueThisMonth, setConsultationValueThisMonth] = useState(0);
	const [revenueValueLastMonth, setRevenueValueLastMonth] = useState(0);
	const [revenueValueThisMonth, setRevenueValueThisMonth] = useState(0);
	const [arrow, setArrow] = useState(false);
	const [revenueArrow, setRevenueArrow] = useState(false);
	const percentageChange = (x, y) => (x / y) * 100 - 100;

	useEffect(() => {
		if (consultationsMetrics) {
			Object.entries(consultationsMetrics.totalNumberOfConsultationsPerMonth).map(([key, value]) => {
				if (endMonth === key.substring(5, 8)) {
					setConsultationValueThisMonth(value);
				}

				if (paddedMonth === key.substring(5, 8)) {
					setConsultationValueLastMonth(value);
				}

				const percentDiffConsultation = percentageChange(consultationValueThisMonth, consultationValueLastMonth);

				if (consultationValueLastMonth !== 0) {
					setConsultationDifference(percentDiffConsultation);
				} else {
					setConsultationDifference(0);
				}
				consultationValueLastMonth > consultationValueThisMonth ? setArrow(false) : setArrow(true);
			});
		}
		if (amountPaidForConsultationsOverTimeMetrics) {
			amountPaidForConsultationsOverTimeMetrics.map((item) => {
				const percentDiffRevenue = percentageChange(revenueValueThisMonth, revenueValueLastMonth);

				if (endMonth === item.period.substring(5, 8)) {
					setRevenueValueThisMonth(item.amountPaid);
				}
				if (paddedMonth === item.period.substring(5, 8)) {
					setRevenueValueLastMonth(item.amountPaid);
				}

				if (revenueValueLastMonth !== 0) {
					setRevenueDifference(percentDiffRevenue);
				} else {
					setRevenueDifference(revenueValueThisMonth);
				}

				revenueValueLastMonth > revenueValueThisMonth ? setRevenueArrow(false) : setRevenueArrow(true);
			});
		}
	}, [
		consultationsMetrics,
		amountPaidForConsultationsOverTimeMetrics,
		consultationValueLastMonth,
		consultationValueThisMonth,
		revenueValueThisMonth,
		revenueValueLastMonth,
		paddedMonth,
		endMonth
	]);
	return {
		consultationdifference,
		revenueDifference,
		arrow,
		revenueArrow,
		consultationValueLastMonth,
		revenueValueLastMonth
	};
};

export default useStatsCard;
