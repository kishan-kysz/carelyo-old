package com.carelyo.v1.dto.summary;

import com.carelyo.v1.dto.ValidationMessages;
import java.time.LocalDateTime;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Value;

@Value
public class PrescriptionFormDTO {

  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Long consultationId;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Long patientId;
  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  String recipientName;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  LocalDateTime issueDate;
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

  @Value
  public static class PrescriptionFormRequest {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long consultationId;
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

  }

  @Value
  public static class UpdatePrescriptionFormRequest {

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

  }

}
