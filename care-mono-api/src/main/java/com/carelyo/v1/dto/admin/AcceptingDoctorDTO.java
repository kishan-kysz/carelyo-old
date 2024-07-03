package com.carelyo.v1.dto.admin;

import com.carelyo.v1.dto.ValidationMessages;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Value;

@Value
public class AcceptingDoctorDTO {

  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Long userId;
  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  @Size(max = 50, message = ValidationMessages.INVALID_FIELD_SIZE)
  @Email(message = ValidationMessages.INVALID_FIELD_VALUE)
  String email;
  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  String firstName;
  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  String lastName;

}
