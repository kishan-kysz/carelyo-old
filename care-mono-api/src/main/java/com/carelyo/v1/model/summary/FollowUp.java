package com.carelyo.v1.model.summary;

import com.carelyo.v1.dto.summary.FollowUpDTO;
import com.carelyo.v1.dto.summary.FollowUpDTO.NewFollowUpDTO;
import com.carelyo.v1.enums.EFollowUpStatus;
import com.carelyo.v1.model.BaseModel;
import java.time.LocalDateTime;
import javax.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class FollowUp extends BaseModel {


  Long consultationId;
  Long doctorId;
  @DateTimeFormat(iso = ISO.DATE_TIME)
  LocalDateTime followUpDate;
  Double price;
  Long patientId;
  String purpose;
  String location;
  String status;

  public FollowUp(NewFollowUpDTO followUpFormDTO) {
    this.consultationId = followUpFormDTO.getConsultationId();
    this.followUpDate = followUpFormDTO.getFollowUpDate();
    this.purpose = followUpFormDTO.getPurpose();
    this.location = followUpFormDTO.getLocation();
    this.status = EFollowUpStatus.INACTIVE.getTextVal();

  }

  public FollowUpDTO getFullDTO() {
    return new FollowUpDTO(
        this.getId(),
        this.price,
        this.purpose,
        this.location,
        this.status,
        this.followUpDate,
        this.getCreatedAt(),
        this.getUpdatedAt(),
        null,
        null);
  }
}
