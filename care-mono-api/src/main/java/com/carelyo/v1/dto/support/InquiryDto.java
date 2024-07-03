package com.carelyo.v1.dto.support;

import com.carelyo.v1.dto.Base64DTO;
import com.carelyo.v1.dto.ValidationMessages;
import com.carelyo.v1.model.role.ERole;
import com.carelyo.v1.model.support.SupportInquiry;
import com.carelyo.v1.utils.enums.SupportEnums.SupportStatus;
import java.time.LocalDateTime;
import java.util.List;
import javax.annotation.Nullable;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Data;
import lombok.Value;

public class InquiryDto {

  @Value
  public static class InquiryRequest {

    @Size(max = 50, message = ValidationMessages.INVALID_FIELD_SIZE)
    String subject;
    @Size(max = 500, message = ValidationMessages.INVALID_FIELD_SIZE)
    String message;

    @Nullable
    List<Base64DTO> images;
  }

  @Value
  public static class UpdateInquiryRequest {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long id;
    @Size(max = 50, message = ValidationMessages.INVALID_FIELD_SIZE)
    String subject;
    @Size(max = 500, message = ValidationMessages.INVALID_FIELD_SIZE)
    String message;
    @Nullable
    List<Base64DTO> images;
  }

  @Value
  private static class Issuer {

    Long id;
    String email;
    String mobile;
    ERole role;
    String name;
  }


  @Data
  public static class InquiryResponse {

    Long id;
    Issuer issuer;
    String subject;
    String message;
    List<String> images;
    SupportStatus status;
    LocalDateTime resolvedAt;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    public InquiryResponse(SupportInquiry inquiry, List<String> images) {
      this.id = inquiry.getId();
      this.issuer = new Issuer(
          inquiry.getIssuer().getId(),
          inquiry.getIssuer().getEmail(),
          inquiry.getIssuer().getMobile(),
          inquiry.getIssuer().getRole().getName(),
          inquiry.getIssuerName()
      );
      this.subject = inquiry.getSubject();
      this.message = inquiry.getMessage();
      this.status = inquiry.getStatus();
      if (images != null) {
        this.images = images;
      }
      this.resolvedAt = inquiry.getResolvedAt();
      this.createdAt = inquiry.getCreatedAt();
      this.updatedAt = inquiry.getUpdatedAt();
    }
  }


}
