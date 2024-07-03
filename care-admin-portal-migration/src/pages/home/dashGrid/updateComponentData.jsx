import { useMemo } from 'react';

const updateComponentData = (
  doctors,
  allConsultations,
  patients,
  numberOfOngoingConsultationsMetrics,
  consultationsGenderDistributionMetrics,
  totalCompletedConsultationTimePerDoctorMetrics,
  acceptingDoctorsResponseMetrics,
  MonthlyRevenue,
  numberOfAcceptedConsultationsMetrics,
  numberOfBookedConsultationsMetrics,
  numberOfFinishedConsultationsMetrics,
  numberOfIncomingConsultationsMetrics,
  amountPaidForConsultationsOverTimeMetrics,
  numberOfConsultationsByAgeSpansMetrics,
  relationshipBetweenIllnessAndGenderMetrics,
  relationshipBetweenIllnessAndAgeMetrics,
  relationshipBetweenIllnessAndTimeMetrics,
  finishedConsultationsRatingDistributionMetrics,

) => {
  return useMemo(
    () => [
      {
        key: 'Registered Doctors',
        value: doctors?.length
      },
      {
        key: 'Total Consultations',
        value: allConsultations?.length
      },
      {
        key: 'Total Patients',
        value: patients?.length
      },
      {
        key: 'Ongoing Consultations',
        value: numberOfOngoingConsultationsMetrics
      },
      {
        key: 'Consultations Gender Distribution',
        value: consultationsGenderDistributionMetrics
      },
      {
        key: 'Consultations Total Time Spent Per Doctor',
        value: totalCompletedConsultationTimePerDoctorMetrics
      },
      {
        key: 'Current Accepted Consultations Per Doctor',
        value: acceptingDoctorsResponseMetrics
      },
      {
        key: 'Monthly Revenue',
        value: MonthlyRevenue
      },
      {
        key: 'Accepted Consultations',
        value: numberOfAcceptedConsultationsMetrics
      },
      {
        key: 'Booked Consultations',
        value: numberOfBookedConsultationsMetrics
      },
      {
        key: 'Finished Consultations',
        value: numberOfFinishedConsultationsMetrics
      },
      {
        key: 'Incoming Consultations',
        value: numberOfIncomingConsultationsMetrics
      },
      {
        key: 'Amount paid for consultations',
        value: amountPaidForConsultationsOverTimeMetrics
      },
      {
        key: 'Consultations Age Distribution',
        value: numberOfConsultationsByAgeSpansMetrics
      },
      {
        key: 'Illness And Gender',
        value: relationshipBetweenIllnessAndGenderMetrics
      },
      {
        key: 'Illness And Age',
        value: relationshipBetweenIllnessAndAgeMetrics
      },
      {
        key: 'Illness And Time',
        value: relationshipBetweenIllnessAndTimeMetrics
      },
      {
        key: 'Consultations Rating Distribution',
        value: finishedConsultationsRatingDistributionMetrics
      }
    ],
    [
      doctors,
      allConsultations,
      patients,
      consultationsGenderDistributionMetrics,
      amountPaidForConsultationsOverTimeMetrics,
      numberOfOngoingConsultationsMetrics,
      numberOfAcceptedConsultationsMetrics,
      numberOfBookedConsultationsMetrics,
      numberOfFinishedConsultationsMetrics,
      numberOfIncomingConsultationsMetrics,
      totalCompletedConsultationTimePerDoctorMetrics,
      acceptingDoctorsResponseMetrics,
      MonthlyRevenue,
      relationshipBetweenIllnessAndGenderMetrics,
      numberOfConsultationsByAgeSpansMetrics,
      relationshipBetweenIllnessAndAgeMetrics,
      relationshipBetweenIllnessAndTimeMetrics,
      finishedConsultationsRatingDistributionMetrics,
	
    ]
  );
}
export default updateComponentData;