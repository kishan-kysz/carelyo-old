package com.carelyo.v1.dto.admin;

import com.carelyo.v1.dto.ValidationMessages;
import java.util.Map;
import javax.validation.constraints.NotNull;
import lombok.Value;

@Value
public class ConsultationMetricsDTO {

  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Integer totalNumberOfConsultations;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Map<String, Integer> totalNumberOfConsultationsPerYear;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Map<String, Integer> totalNumberOfConsultationsPerMonth;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Map<String, Integer> totalNumberOfConsultationsPerWeek;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Map<String, Integer> totalNumberOfConsultationsPerDay;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Map<String, Integer> totalNumberOfConsultationsPerHour;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Map<String, Double> avgNumberOfConsultationsPerHourPerYear;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Map<String, Double> avgNumberOfConsultationsPerHourPerMonth;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Map<String, Double> avgNumberOfConsultationsPerHourPerWeek;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Map<String, Double> avgNumberOfConsultationsPerHourPerDay;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Map<String, Double> avgNumberOfConsultationsPerDayPerYear;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Map<String, Double> avgNumberOfConsultationsPerDayPerMonth;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Map<String, Double> avgNumberOfConsultationsPerDayPerWeek;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Map<String, Double> avgNumberOfConsultationsPerWeekPerYear;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Map<String, Double> avgNumberOfConsultationsPerWeekPerMonth;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Map<String, Double> avgNumberOfConsultationsPerMonthPerYear;

}