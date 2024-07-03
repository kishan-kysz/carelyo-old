package com.carelyo.v1.model.summary;


import com.carelyo.v1.dto.summary.LabrequestDTO;
import com.carelyo.v1.dto.summary.LabrequestDTO.OngoingLabDTO;
import com.carelyo.v1.model.BaseModel;
import javax.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@Entity
@NoArgsConstructor

public class Labrequest extends BaseModel {

  private Long consultationId;
  private String doctorName;
  private String patientName;
  private Long patientId;
  private Long doctorId;
  private String reason;
  private String test;
  private Long childId;

  public LabrequestDTO getLabDTO() {
    return new LabrequestDTO(this);
  }

  public OngoingLabDTO getOngoingLabDTO() {
    return new OngoingLabDTO(this.getId(), this.reason, this.test, getCreatedAt(),
        getUpdatedAt());
  }

}
