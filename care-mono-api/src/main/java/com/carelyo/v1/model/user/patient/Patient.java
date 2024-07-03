package com.carelyo.v1.model.user.patient;

import com.carelyo.v1.dto.patient.PatientDTO.PatientAgeAndGenderDTO;
import com.carelyo.v1.model.BaseModel;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * patient data
 */
@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Patient extends BaseModel {

  @Embedded
  Polygenic polygenic;
  @Embedded
  Locale locale;
  @Embedded
  Location location;
  private Long userId;
  // Personal
  private String title;
  private String nationalIdNumber;
  private String firstName;
  private String surName;
  private LocalDateTime dateOfBirth;
  private String maritalStatus;
  private boolean hasChildren;
  private int numOfChildren;
  @OneToMany(cascade = CascadeType.ALL)
  private List<Relationship> relationships;
  @ElementCollection
  private List<String> allergies;
  @ElementCollection
  private List<String> medicalProblems;
  @ElementCollection
  private List<String> disabilities;
  @Lob
  private byte[] ninCard;
  String ninCardFileName;

  private Long providerId;

  public Patient(Long userId) {
    this.userId = userId;
    this.relationships = new ArrayList<>();
  }

  public void setAllergies(List<String> allergies) {
    if (allergies != null) {
      this.allergies = allergies;
    }
  }

  public void setMedicalProblems(List<String> medicalProblems) {
    if (medicalProblems != null) {
      this.medicalProblems = medicalProblems;
    }
  }

  public void setDisabilities(List<String> disabilities) {
    if (disabilities != null) {
      this.disabilities = disabilities;
    }
  }

  public PatientAgeAndGenderDTO getAgeAndGender() {
    return new PatientAgeAndGenderDTO(dateOfBirth, polygenic.getGender(), getId(), false);
  }

}
