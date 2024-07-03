package com.carelyo.v1.model.consultation;

import java.util.List;

/**
 * Sorter of Consultations
 */
public class ConsultationSorter {

  private final List<Consultation> consultations;

  public ConsultationSorter(List<Consultation> consultations) {
    this.consultations = consultations;
  }

  public List<Consultation> getSortedConsultationsByTimeAccepted() {
    consultations.sort(Consultation.timeAcceptedComparator);
    return consultations;
  }

  public List<Consultation> getSortedConsultationsByTimeBooked() {
    consultations.sort(Consultation.timeBookedComparator);
    return consultations;
  }

  public List<Consultation> getSortedConsultationsByTimeFinished() {
    consultations.sort(Consultation.timeFinishedComparator);
    return consultations;
  }
}
