package com.carelyo.v1.model.invitation;

import com.carelyo.v1.dto.invitation.InvitationDTO.InvitationResponseDTO;
import com.carelyo.v1.model.BaseModel;
import com.carelyo.v1.utils.enums.EInvitation;
import java.time.LocalDateTime;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Invitation extends BaseModel {

  @Email
  private String email;
  private String name;
  private String invitedByName;
  private Long invitedById;
  private LocalDateTime registrationDate;
  @Enumerated(EnumType.STRING)
  private EInvitation status;

  public Invitation(String email, String name) {
    this.email = email;
    this.name = name;
    this.status = EInvitation.not_sent;
  }


  public InvitationResponseDTO getFullDTO() {
    return new InvitationResponseDTO(getId(), email, name, registrationDate,
        status, getCreatedAt());
  }

}
