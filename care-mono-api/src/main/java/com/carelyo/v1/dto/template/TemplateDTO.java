package com.carelyo.v1.dto.template;

import com.carelyo.v1.dto.ValidationMessages;
import com.carelyo.v1.enums.ETemplateTypes;
import java.time.LocalDateTime;
import javax.annotation.Nullable;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.Data;
import lombok.Value;

public class TemplateDTO {

  @Data
  public static class Update {

    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String html;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    ETemplateTypes type;
    @Nullable
    String subject;
    @Nullable
    String sender;

  }

  @Value
  public static class Response {

    Long id;
    String html;
    String templateType;
    String subject;
    String sender;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

  }

}
