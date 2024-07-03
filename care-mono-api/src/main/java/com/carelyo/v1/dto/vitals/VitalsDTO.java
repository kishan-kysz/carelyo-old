package com.carelyo.v1.dto.vitals;

import com.carelyo.v1.dto.ValidationMessages;
import com.carelyo.v1.enums.EMenstruationFlow;
import com.carelyo.v1.model.vitals.BloodGlucose;
import com.carelyo.v1.model.vitals.BloodOxygen;
import com.carelyo.v1.model.vitals.BloodPressure;
import com.carelyo.v1.model.vitals.BodyTemperature;
import com.carelyo.v1.model.vitals.HeartRate;
import com.carelyo.v1.model.vitals.Menstruation;
import com.carelyo.v1.model.vitals.RespiratoryRate;
import java.time.LocalDateTime;
import java.util.List;
import javax.annotation.Nullable;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import lombok.Value;

@Value
public class VitalsDTO {

  List<BloodGlucose> bloodGlucose;
  List<BloodOxygen> bloodOxygen;
  List<BloodPressure> bloodPressure;
  List<BodyTemperature> bodyTemperature;
  List<HeartRate> heartRate;
  List<Menstruation> menstruation;
  List<RespiratoryRate> respiratoryRate;

  @Value
  public static class CreateVitals {

    @Nullable
    CreateBloodGlucose bloodGlucose;
    @Nullable
    CreateBloodOxygen bloodOxygen;
    @Nullable
    CreateBloodPressure bloodPressure;
    @Nullable
    CreateBodyTemperature bodyTemperature;
    @Nullable
    CreateHeartRate heartRate;
    @Nullable
    CreateMenstruation menstruation;
    @Nullable
    CreateRespiratoryRate respiratoryRate;
    @Nullable
    Long childId;
  }

  @Value
  public static class CreateBloodGlucose {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime date;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Double bloodGlucoseMmolPerL;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime mealTime;
  }

  @Value
  public static class CreateBloodOxygen {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime date;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    @Min(value = 0, message = ValidationMessages.INVALID_FIELD_VALUE)
    @Max(value = 100, message = ValidationMessages.INVALID_FIELD_VALUE)
    Double bloodOxygenPercentage;
  }

  @Value
  public static class CreateBloodPressure {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime date;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Double systolicMmHg;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Double diastolicMmHg;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    String posture;
  }

  @Value
  public static class CreateBodyTemperature {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime date;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Double bodyTemperatureCelsius;
  }

  @Value
  public static class CreateHeartRate {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime date;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Double heartRateBpm;
  }

  @Value
  public static class CreateMenstruation {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    EMenstruationFlow flow;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Boolean startOfCycle;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime date;
    @Nullable
    LocalDateTime endOfCycleDate;
    @Nullable
    LocalDateTime startOfCycleDate;
    @Nullable
    String contraceptive;
  }

  @Value
  public static class CreateRespiratoryRate {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime date;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Double breathsPerMinute;
  }
}
