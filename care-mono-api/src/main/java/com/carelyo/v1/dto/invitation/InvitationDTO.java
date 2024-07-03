package com.carelyo.v1.dto.invitation;

import com.carelyo.v1.dto.ValidationMessages;
import com.carelyo.v1.utils.enums.EInvitation;
import java.time.LocalDateTime;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import lombok.Value;

@Value
public class InvitationDTO {

  Long id;

  String email;

  String name;

  String invitedByName;

  Long invitedById;

  LocalDateTime registrationDate;

  EInvitation status;


  @Value
  public static class InvitationResponseDTO {

    Long id;

    String email;

    String name;
    LocalDateTime registrationDate;
    EInvitation status;
    LocalDateTime createdAt;

  }

  @Value
  public static class InvitationRequestDTO {

    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String name;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    @Size(max = 50, message = ValidationMessages.INVALID_FIELD_SIZE)
    @Email(message = ValidationMessages.INVALID_FIELD_VALUE)
    String email;

  }
}
