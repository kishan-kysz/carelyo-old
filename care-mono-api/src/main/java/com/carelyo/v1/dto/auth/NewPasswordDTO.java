package com.carelyo.v1.dto.auth;

import com.carelyo.v1.dto.ValidationMessages;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import lombok.Value;

@Value
public class NewPasswordDTO {

  @NotEmpty(message = ValidationMessages.IS_REQUIRED)
  @Size(max = 50, message = ValidationMessages.INVALID_FIELD_SIZE)
  @Email(message = ValidationMessages.INVALID_FIELD_VALUE)
  String email;
  @NotEmpty(message = ValidationMessages.IS_REQUIRED)
  @Size(min = 6, max = 40, message = ValidationMessages.INVALID_FIELD_SIZE)
  String password;
  @NotEmpty(message = ValidationMessages.IS_REQUIRED)
  String token;

}

