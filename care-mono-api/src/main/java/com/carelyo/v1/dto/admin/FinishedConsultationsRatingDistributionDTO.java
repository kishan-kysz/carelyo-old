package com.carelyo.v1.dto.admin;

import com.carelyo.v1.dto.ValidationMessages;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Value;

@Value
public class FinishedConsultationsRatingDistributionDTO {

  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  String rating;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Integer quantity;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Double ratio;

}
