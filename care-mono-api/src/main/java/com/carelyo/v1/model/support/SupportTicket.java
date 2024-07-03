package com.carelyo.v1.model.support;

import com.carelyo.v1.dto.support.SupportDto.SupportAdminDTO;
import com.carelyo.v1.dto.support.SupportDto.SupportTicketListResponse;
import com.carelyo.v1.dto.support.SupportDto.SupportTicketResponse;
import com.carelyo.v1.model.BaseModel;
import com.carelyo.v1.model.user.SystemAdmin;
import com.carelyo.v1.utils.enums.SupportEnums.Category;
import com.carelyo.v1.utils.enums.SupportEnums.SupportPriority;
import com.carelyo.v1.utils.enums.SupportEnums.SupportStatus;
import com.carelyo.v1.utils.enums.SupportEnums.SupportType;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class SupportTicket extends BaseModel implements Serializable {

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "assigneeId")
  SystemAdmin assignee;
  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "inquiryId")
  SupportInquiry inquiry;
  @ManyToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "createdById", referencedColumnName = "id")
  SystemAdmin createdBy;

  @OneToMany(cascade = CascadeType.ALL, targetEntity = SupportActions.class, mappedBy = "ticketId", fetch = FetchType.LAZY)
  List<SupportActions> actionsTaken = new ArrayList<>();
  @OneToMany(cascade = CascadeType.ALL, targetEntity = SupportComments.class, mappedBy = "ticketId", fetch = FetchType.LAZY)
  List<SupportComments> comments = new ArrayList<>();
  @Enumerated(EnumType.STRING)
  SupportStatus status;
  @Enumerated(EnumType.STRING)
  SupportPriority priority;
  @Enumerated(EnumType.STRING)
  SupportType type;
  @Enumerated(EnumType.STRING)
  Category category;
  @ElementCollection(fetch = FetchType.LAZY)
  @Column(name = "tags")
  @CollectionTable(name = "support_ticket_tags", joinColumns = @JoinColumn(name = "support_ticket_id"))
  List<String> tags;

  public SupportTicketListResponse getTicketListResponse() {
    return new SupportTicketListResponse(getId(),
        this.createdBy != null ? this.createdBy.getUserId() : null, this.inquiry.getId(),
        this.assignee != null ? this.assignee.getUserId() : null,
        this.category, this.type, this.priority, this.status, this.tags);

  }

  public SupportTicketResponse getTicketResponse() {
    SupportAdminDTO assignee =
        this.assignee != null ? new SupportAdminDTO(this.assignee.getUserId(),
            this.assignee.getFirstName(),
            this.assignee.getLastName()) : null;
    SupportAdminDTO creator =
        this.createdBy != null ? new SupportAdminDTO(this.createdBy.getUserId(),
            this.createdBy.getFirstName(),
            this.createdBy.getLastName()) : null;
    return new SupportTicketResponse(getId(), creator, this.inquiry.getResponse(null), assignee,
        this.category, this.type, this.priority, this.status, this.actionsTaken,
        this.comments, this.tags);

  }


}
