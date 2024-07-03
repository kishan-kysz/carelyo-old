package com.carelyo.v1.dto.support;

import com.carelyo.v1.dto.ValidationMessages;
import com.carelyo.v1.dto.support.InquiryDto.InquiryResponse;
import com.carelyo.v1.model.support.SupportActions;
import com.carelyo.v1.model.support.SupportComments;
import com.carelyo.v1.utils.enums.SupportEnums.Category;
import com.carelyo.v1.utils.enums.SupportEnums.SupportPriority;
import com.carelyo.v1.utils.enums.SupportEnums.SupportStatus;
import com.carelyo.v1.utils.enums.SupportEnums.SupportType;
import java.util.List;
import javax.annotation.Nullable;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.Value;

public class SupportDto {

  @Data
  public static class CreateSupportTicket {

    Long createdBy;
    Long inquiryId;
    Category category;
    SupportType type;
    SupportPriority priority;
    Long assigneeId;
    @Nullable
    List<String> tags;

    public CreateSupportTicket(Long createdBy, CreateSupportRequest createSupportRequest) {
      this.createdBy = createdBy;
      this.inquiryId = createSupportRequest.getInquiryId();
      this.category = createSupportRequest.getCategory();
      this.type = createSupportRequest.getType();
      this.priority = createSupportRequest.getPriority();
      this.assigneeId = createSupportRequest.getAssigneeId();
      this.tags = createSupportRequest.getTags();
    }
  }

  @Value
  public static class CreateSupportRequest {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long inquiryId;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Category category;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    SupportType type;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    SupportPriority priority;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long assigneeId;
    @Nullable
    List<String> tags;
  }

  @Value
  public static class UpdateSupportTicket {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long id;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long assigneeId;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Category category;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    SupportType type;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    SupportPriority priority;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    SupportStatus status;
    @Nullable
    List<String> tags;
  }

  @Value
  @Setter
  @Getter
  public static class SupportTicketListResponse {

    Long id;
    Long createdById;
    Long inquiryId;
    Long assigneeId;
    Category category;
    SupportType type;
    SupportPriority priority;
    SupportStatus status;
    @Nullable
    List<String> tags;
  }

  @Value
  public static class SupportAdminDTO {

    Long userId;
    String firstName;
    String lastName;
  }


  @Value
  public static class SupportTicketResponse {

    Long id;
    SupportAdminDTO createdBy;
    InquiryResponse inquiry;
    SupportAdminDTO assignee;
    Category category;
    SupportType type;
    SupportPriority priority;
    SupportStatus status;
    List<SupportActions> actionsTaken;
    List<SupportComments> comments;
    List<String> tags;
  }

  @Value
  public static class CreateComment {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long ticketId;
    @Size(min = 1, max = 200, message = ValidationMessages.INVALID_FIELD_SIZE)
    String message;
  }

  @Value
  public static class CreateAction {

    Long ticketId;
    @Size(min = 1, max = 20, message = ValidationMessages.INVALID_FIELD_SIZE)
    String action;
    @Size(min = 1, max = 100, message = ValidationMessages.INVALID_FIELD_SIZE)
    String message;
  }
}
