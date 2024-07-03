package com.carelyo.v1.dto.user;

import com.carelyo.v1.dto.ValidationMessages;
import com.carelyo.v1.model.role.Role;
import java.time.LocalDateTime;
import java.util.Set;
import javax.annotation.Nullable;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.Value;

public class MessageDTO {

  @Value
  public static class CreateRoleSpecificMessage {

    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String subject;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String sender;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String message;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    Set<Role> roles;

  }

  @Value
  public static class CreateUserSpecificMessage {

    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String subject;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String sender;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String message;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long userId;

  }

  @Value
  public static class CreateMessageToAllUsers {

    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String subject;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String sender;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String message;

  }

  @Value
  public static class UpdateWelcomeMessage {

    @Nullable
    String subject;
    @Nullable
    String sender;
    @Nullable
    String message;

  }

  @Value
  public static class UserSpecificResponse {

    Long id;
    String subject;
    String sender;
    String message;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean hasBeenRead;

  }

  @Value
  public static class Response {

    Long id;
    String subject;
    String sender;
    String message;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

  }

}
