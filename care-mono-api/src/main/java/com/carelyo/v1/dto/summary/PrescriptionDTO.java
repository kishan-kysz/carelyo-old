package com.carelyo.v1.dto.summary;

import com.carelyo.v1.dto.ValidationMessages;
import java.time.LocalDateTime;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Setter;
import lombok.Value;

@Value
@Setter
public class PrescriptionDTO {

  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Long id;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  LocalDateTime issueDate;
  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  String issuerName;
  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  String dosage;
  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  String frequency;
  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  String illness;
  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  String quantity;
  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  String medicationName;
  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  String medicationType;
  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  String medicationStrength;
  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  String treatmentDuration;
  /*
  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  String withdrawals;
  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  String amountPerWithdrawal;

   */
  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  String status;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Long consultationId;
  String patientName;
  String recipientName;

  @Value
  public static class AdminDTO {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long id;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long issueDate;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long doctorId;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String dosage;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String frequency;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String illness;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String quantity;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String medicationName;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String medicationType;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String medicationStrength;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String treatmentDuration;
    /*
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String withdrawals;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String amountPerWithdrawal;

     */
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String status;

  }

}
