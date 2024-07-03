package com.carelyo.v1.model.user.child;

import com.carelyo.v1.dto.ValidationMessages;
import com.carelyo.v1.dto.patient.PatientDTO.PatientAgeAndGenderDTO;
import com.carelyo.v1.enums.EChildStatus;
import com.carelyo.v1.model.BaseModel;
import com.carelyo.v1.model.user.Partner;
import com.carelyo.v1.model.user.patient.Patient;
import com.carelyo.v1.model.user.patient.Polygenic;
import java.time.LocalDateTime;
import java.util.List;
import javax.persistence.ElementCollection;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Child extends BaseModel {

  @Embedded
  private Polygenic polygenic;
  @NotEmpty(message = ValidationMessages.IS_REQUIRED)
  private String name;
  private LocalDateTime dateOfBirth;
  @ManyToOne
  private Partner partner;
  @Lob
  private byte[] birthCertificate;
  private String birthCertFileName;
  private String ninCardFileName;
  @Lob
  private byte[] NINCard;
  @ManyToOne
  private Patient patient;
  @ManyToOne
  private Patient partnerPatient;
  private EChildStatus status;
  private String notes;
  @ElementCollection
  private List<String> allergies;
  @ElementCollection
  private List<String> medicalProblems;
  @ElementCollection
  private List<String> disabilities;
  private Boolean singleParent;

  public PatientAgeAndGenderDTO getAgeAndGender() {
    return new PatientAgeAndGenderDTO(dateOfBirth, polygenic.getGender(), getId(), true);
  }
}
