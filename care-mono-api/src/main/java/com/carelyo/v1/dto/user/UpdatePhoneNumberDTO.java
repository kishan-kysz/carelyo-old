package com.carelyo.v1.dto.user;

import com.carelyo.v1.dto.ValidationMessages;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import lombok.Value;

@Value
public class UpdatePhoneNumberDTO {

  @NotEmpty(message = ValidationMessages.IS_REQUIRED)
  @Size(min = 6, max = 40, message = ValidationMessages.INVALID_FIELD_SIZE)
  String password;
  @NotEmpty(message = ValidationMessages.IS_REQUIRED)
  String newPhoneNumber;

}
