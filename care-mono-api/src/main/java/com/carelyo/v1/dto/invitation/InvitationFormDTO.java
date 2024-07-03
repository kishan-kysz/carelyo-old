package com.carelyo.v1.dto.invitation;

import com.carelyo.v1.dto.ValidationMessages;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import lombok.Value;


@Value
public class InvitationFormDTO {

  @NotEmpty(message = ValidationMessages.IS_REQUIRED)
  String name;
  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  @Size(max = 50, message = ValidationMessages.INVALID_FIELD_SIZE)
  @Email(message = ValidationMessages.INVALID_FIELD_VALUE)
  String email;

}


