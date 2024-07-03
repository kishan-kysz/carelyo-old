package com.carelyo.v1.dto.admin;

import com.carelyo.v1.dto.ValidationMessages;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Value;

@Value
public class ConsultationsGenderDistributionDTO {

  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  String gender;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Integer quantity;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Double ratio;

}
