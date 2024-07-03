package com.carelyo.v1.dto.admin;

import com.carelyo.v1.dto.ValidationMessages;
import java.time.LocalDateTime;
import javax.validation.constraints.NotNull;
import lombok.Value;

@Value
public class ConsultationMetricsPeriodDTO {

  @NotNull(message = ValidationMessages.IS_REQUIRED)
  LocalDateTime startDate;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  LocalDateTime endDate;

}
