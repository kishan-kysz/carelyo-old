package com.carelyo.v1.dto.auth;

import com.carelyo.v1.dto.ValidationMessages;
import java.util.List;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Value;

@Value
public class LoggedInDTO {

  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Long id;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Long userId;
  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  String mobile;
  @NotEmpty(message = ValidationMessages.IS_REQUIRED)
  @Size(max = 50, message = ValidationMessages.INVALID_FIELD_SIZE)
  @Email(message = ValidationMessages.INVALID_FIELD_VALUE)
  String email;
  @NotEmpty(message = ValidationMessages.IS_REQUIRED)
  String token;
  List<String> role;

}
