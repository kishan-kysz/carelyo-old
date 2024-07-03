import { useEffect , useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import {
	getConsultationsMetrics,
	getAcceptingDoctorsResponseMetrics,
	getTotalCompletedConsultationTimePerDoctorMetrics,
	getConsultationsGenderDistributionMetrics,
	getAmountPaidForConsultationsOverTime,
	getNumberOfOngoingConsultationsMetrics,
	getNumberOfAcceptedConsultationsMetrics,
	getNumberOfBookedConsultationsMetrics,
	getNumberOfFinishedConsultationsMetrics,
	getNumberOfIncomingConsultationsMetrics,
	getNumberOfConsultationsByAgeSpansMetrics,
	getRelationshipBetweenIllnessAndGenderMetrics,
	getRelationshipBetweenIllnessAndAgeMetrics,
	getRelationshipBetweenIllnessAndTimeMetrics,
	getFinishedConsultationsRatingDistribution
} from '../api/index';

export const useMetricsStartDateEndDate = (startDate: Date, endDate: Date) => {
	const [loading, setLoading] = useState(false);
const { data: consultationsMetrics, isLoading: loadingConsultationsMetrics } = useQuery({
  queryKey: ['getConsultationsMetrics', startDate, endDate],
  queryFn: () => getConsultationsMetrics(startDate, endDate)
});

	useEffect(() => {
		if (loadingConsultationsMetrics) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [consultationsMetrics, loadingConsultationsMetrics]);

	return {
		consultationsMetrics,
		loadingConsultationsMetrics,
		loading
	};
};

export const useMetrics = () => {
		const [loading, setLoading] = useState(false);
	const { data: acceptingDoctorsResponseMetrics, isLoading: loadingAcceptingDoctorsResponseMetrics } = useQuery({
		queryKey: ['getAcceptingDoctorsResponseMetrics'],
		queryFn: () => getAcceptingDoctorsResponseMetrics()
	});
	const { data: numberOfOngoingConsultationsMetrics, isLoading: loadingNumberOfOngoingConsultationsMetrics } = useQuery({
		queryKey: ['getNumberOfOngoingConsultationsMetrics'],
		queryFn: () => getNumberOfOngoingConsultationsMetrics()
	});
	const { data: numberOfAcceptedConsultationsMetrics, isLoading: loadingNumberOfAcceptedConsultationsMetrics } = useQuery({
		queryKey: ['getNumberOfAcceptedConsultationsMetrics'],
		queryFn: () => getNumberOfAcceptedConsultationsMetrics()
	});
	const { data: numberOfBookedConsultationsMetrics, isLoading: loadingNumberOfBookedConsultationsMetrics } = useQuery({
		queryKey: ['getNumberOfBookedConsultationsMetrics'],
		queryFn: () => getNumberOfBookedConsultationsMetrics()
	});
	const { data: numberOfFinishedConsultationsMetrics, isLoading: loadingNumberOfFinishedConsultationsMetrics } = useQuery({
		queryKey: ['getNumberOfFinishedConsultationsMetrics'],
		queryFn: () => getNumberOfFinishedConsultationsMetrics()
	});
	const { data: numberOfIncomingConsultationsMetrics, isLoading: loadingNumberOfIncomingConsultationsMetrics } = useQuery({
		queryKey: ['getNumberOfIncomingConsultationsMetrics'],
		queryFn: () => getNumberOfIncomingConsultationsMetrics()
	});
	const { data: totalCompletedConsultationTimePerDoctorMetrics, isLoading: loadingTotalCompletedConsultationTimePerDoctorMetrics } = useQuery({
		queryKey: ['getTotalCompletedConsultationTimePerDoctorMetrics'],
		queryFn: () => getTotalCompletedConsultationTimePerDoctorMetrics()
	});
	const { data: consultationsGenderDistributionMetrics, isLoading: loadingConsultationsGenderDistributionMetrics } = useQuery({
		queryKey: ['getConsultationsGenderDistributionMetrics'],
		queryFn: () => getConsultationsGenderDistributionMetrics()
	});
	const { data: relationshipBetweenIllnessAndGenderMetrics, isLoading: loadingRelationshipBetweenIllnessAndGenderMetrics } = useQuery({
		queryKey: ['getRelationshipBetweenIllnessAndGenderMetrics'],
		queryFn: () => getRelationshipBetweenIllnessAndGenderMetrics()
	});
	const { data: relationshipBetweenIllnessAndAgeMetrics, isLoading: loadingRelationshipBetweenIllnessAndAgeMetrics } = useQuery({
		queryKey: ['getRelationshipBetweenIllnessAndAgeMetrics'],
		queryFn: () => getRelationshipBetweenIllnessAndAgeMetrics()
	});
	const { data: relationshipBetweenIllnessAndTimeMetrics, isLoading: loadingRelationshipBetweenIllnessAndTimeMetrics } = useQuery({
		queryKey: ['getRelationshipBetweenIllnessAndTimeMetrics'],
		queryFn: () => getRelationshipBetweenIllnessAndTimeMetrics()
	});
	const { data: finishedConsultationsRatingDistributionMetrics, isLoading: loadingFinishedConsultationsRatingDistributionMetrics } = useQuery({
		queryKey: ['getFinishedConsultationsRatingDistribution'],
		queryFn: () => getFinishedConsultationsRatingDistribution()
	});

	useEffect(() => {
		if (
			loadingAcceptingDoctorsResponseMetrics ||
			loadingTotalCompletedConsultationTimePerDoctorMetrics ||
			loadingConsultationsGenderDistributionMetrics ||
			loadingNumberOfOngoingConsultationsMetrics ||
			loadingNumberOfAcceptedConsultationsMetrics ||
			loadingNumberOfBookedConsultationsMetrics ||
			loadingNumberOfFinishedConsultationsMetrics ||
			loadingNumberOfIncomingConsultationsMetrics ||
			loadingRelationshipBetweenIllnessAndGenderMetrics ||
			loadingRelationshipBetweenIllnessAndAgeMetrics ||
			loadingRelationshipBetweenIllnessAndTimeMetrics ||
			loadingFinishedConsultationsRatingDistributionMetrics
		) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [
		acceptingDoctorsResponseMetrics,
		totalCompletedConsultationTimePerDoctorMetrics,
		consultationsGenderDistributionMetrics,
		numberOfOngoingConsultationsMetrics,
		numberOfAcceptedConsultationsMetrics,
		numberOfBookedConsultationsMetrics,
		numberOfFinishedConsultationsMetrics,
		numberOfIncomingConsultationsMetrics,
		relationshipBetweenIllnessAndGenderMetrics,
		relationshipBetweenIllnessAndAgeMetrics,
		relationshipBetweenIllnessAndTimeMetrics,
		finishedConsultationsRatingDistributionMetrics
	]);

	return {
		acceptingDoctorsResponseMetrics,
		loadingAcceptingDoctorsResponseMetrics,
		totalCompletedConsultationTimePerDoctorMetrics,
		loadingTotalCompletedConsultationTimePerDoctorMetrics,
		consultationsGenderDistributionMetrics,
		loadingConsultationsGenderDistributionMetrics,
		numberOfOngoingConsultationsMetrics,
		loadingNumberOfOngoingConsultationsMetrics,
		numberOfAcceptedConsultationsMetrics,
		loadingNumberOfAcceptedConsultationsMetrics,
		numberOfBookedConsultationsMetrics,
		loadingNumberOfBookedConsultationsMetrics,
		numberOfFinishedConsultationsMetrics,
		loadingNumberOfFinishedConsultationsMetrics,
		numberOfIncomingConsultationsMetrics,
		loadingNumberOfIncomingConsultationsMetrics,
		relationshipBetweenIllnessAndGenderMetrics,
		loadingRelationshipBetweenIllnessAndGenderMetrics,
		relationshipBetweenIllnessAndAgeMetrics,
		loadingRelationshipBetweenIllnessAndAgeMetrics,
		relationshipBetweenIllnessAndTimeMetrics,
		loadingRelationshipBetweenIllnessAndTimeMetrics,
		finishedConsultationsRatingDistributionMetrics,
		loadingFinishedConsultationsRatingDistributionMetrics,
		loading
	};
};

export const useMetricsStartDateEndDatePeriod = (startDate: Date, endDate: Date, period: string) => {
	const [loading, setLoading] = useState(false);
const { 
    data: amountPaidForConsultationsOverTimeMetrics, 
    isLoading: loadingAmountPaidForConsultationsOverTimeMetrics 
} = useQuery({
    queryKey: ['getAmountPaidForConsultationsOverTime', startDate, endDate, period],
    queryFn: () => getAmountPaidForConsultationsOverTime(startDate, endDate, period)
});

	useEffect(() => {
		if (loadingAmountPaidForConsultationsOverTimeMetrics) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [amountPaidForConsultationsOverTimeMetrics]);

	return {
		amountPaidForConsultationsOverTimeMetrics,
		loadingAmountPaidForConsultationsOverTimeMetrics,
		loading
	};
};

export const useMetricsAges = (ages: number[]) => {
	const [loading, setLoading] = useState(false);

const { data: numberOfConsultationsByAgeSpansMetrics, isLoading: loadingNumberOfConsultationsByAgeSpansMetrics } = useQuery({
    queryKey: ['getNumberOfConsultationsByAgeSpansMetrics', ages],
    queryFn: () => getNumberOfConsultationsByAgeSpansMetrics(ages)
});

	useEffect(() => {
		if (loadingNumberOfConsultationsByAgeSpansMetrics) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [numberOfConsultationsByAgeSpansMetrics]);

	return {
		numberOfConsultationsByAgeSpansMetrics,
		loadingNumberOfConsultationsByAgeSpansMetrics,
		loading
	};
};
