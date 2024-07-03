package com.carelyo.v1.dto.summary;

import com.carelyo.v1.dto.ValidationMessages;
import java.time.LocalDateTime;
import javax.validation.constraints.Future;
import javax.validation.constraints.NotNull;
import lombok.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

@Value
public class FollowUpDTO {

  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Long id;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Double price;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  String purpose;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  String location;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  String status;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  @DateTimeFormat(iso = ISO.DATE_TIME)
  LocalDateTime followUpDate;
  LocalDateTime createdAt;
  LocalDateTime updatedAt;
  String doctorName;
  String patientName;

  @Value
  public static class NewFollowUpDTO {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long consultationId;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    @Future(message = ValidationMessages.INVALID_DATE_FUTURE)
    @DateTimeFormat(iso = ISO.DATE_TIME)
    LocalDateTime followUpDate;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    String purpose;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    String location;

  }

  @Value
  public static class UpdateFollowUpDTO {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long id;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    @Future(message = ValidationMessages.INVALID_DATE_FUTURE)
    @DateTimeFormat(iso = ISO.DATE_TIME)
    LocalDateTime followUpDate;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    String purpose;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    String location;

  }

}
