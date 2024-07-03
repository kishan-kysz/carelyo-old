package com.carelyo.v1.dto.admin;

import com.carelyo.v1.dto.ValidationMessages;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Value;

@Value
public class NumberOfConsultationsByAgeSpanResponseDTO {

  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  String ageSpan;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Integer numberOfConsultations;

}
