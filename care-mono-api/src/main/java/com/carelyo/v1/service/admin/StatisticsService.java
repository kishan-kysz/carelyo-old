package com.carelyo.v1.service.admin;

import com.carelyo.v1.model.consultation.Consultation;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import com.carelyo.v1.service.consultation.ConsultationService;
import org.springframework.stereotype.Service;

@Service
public class StatisticsService {

  private final ConsultationService consultationService;

  public StatisticsService(ConsultationService consultationService) {
    this.consultationService = consultationService;
  }

  public double getAverageRating(Long userId) {
    List<Consultation> consultations = consultationService.findAllByDoctorId(userId);

    List<Integer> consultationRatings = consultations.stream()
        .map(Consultation::getRating)
        .filter(Objects::nonNull)
        .collect(Collectors.toList());

    return roundNearestEven(consultationRatings.stream()
        .mapToDouble(a -> a)
        .average()
        .orElse(0.0));
  }

  private double roundNearestEven(double avgRating) {
    int integerPart = (int) avgRating;
    double decimalPart = avgRating - integerPart;

    if (decimalPart < 0.5) {
      return integerPart;
    } else if (decimalPart > 0.8) {
      return integerPart + 1.0;
    } else if (decimalPart > 0.5) {
      return integerPart + 0.5;
    } else {
      // decimalPart is exactly 0.5, round to the nearest even integer
      if (integerPart % 2 == 0) {
        return integerPart;
      } else {
        return integerPart + 1.0;
      }
    }
  }

  public Integer getTotalCompletedConsultations(long startDate, long endDate) {
    Optional<List<Consultation>> optionalConsultations = consultationService.getAllByTimeFinishedBetween(
        startDate, endDate);

    return optionalConsultations.map(List::size).orElse(0);
  }

  public Long getAvgConsultationDuration(long startDate, long endDate) {
    Optional<List<Consultation>> optionalConsultations = consultationService.getAllByTimeFinishedBetween(
        startDate, endDate);
    long totalConsultationDuration = 0L;
    if (optionalConsultations.isPresent()) {

      for (Consultation consultation : optionalConsultations.get()) {
        Long timeFinished = consultation.getTimeFinished()
            .atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

        Long timeStarted = consultation.getTimeStarted()
            .atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

        totalConsultationDuration += timeFinished - timeStarted;
      }
      return totalConsultationDuration / optionalConsultations.get().size();

    }
    return 0L;

  }
}