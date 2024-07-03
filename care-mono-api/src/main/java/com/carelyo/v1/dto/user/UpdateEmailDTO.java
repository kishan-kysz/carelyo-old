package com.carelyo.v1.dto.user;

import com.carelyo.v1.dto.ValidationMessages;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import lombok.Value;

@Value
public class UpdateEmailDTO {

  String code;
  @NotEmpty(message = ValidationMessages.IS_REQUIRED)
  @Size(min = 6, max = 40, message = ValidationMessages.INVALID_FIELD_SIZE)
  String password;
  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  @Size(max = 50, message = ValidationMessages.INVALID_FIELD_SIZE)
  @Email(message = ValidationMessages.INVALID_FIELD_VALUE)
  String newEmail;

}
