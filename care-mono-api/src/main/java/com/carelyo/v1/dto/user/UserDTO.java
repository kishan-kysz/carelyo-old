package com.carelyo.v1.dto.user;

import com.carelyo.v1.dto.ValidationMessages;
import com.carelyo.v1.model.role.ERole;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Value;

@Value
public class UserDTO {

  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Long id;
  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  @Size(max = 50, message = ValidationMessages.INVALID_FIELD_SIZE)
  @Email(message = ValidationMessages.INVALID_FIELD_VALUE)
  String email;
  @NotEmpty(message = ValidationMessages.IS_REQUIRED)
  String mobile;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  ERole role;


}
