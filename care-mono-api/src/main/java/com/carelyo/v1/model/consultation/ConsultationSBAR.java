package com.carelyo.v1.model.consultation;

import com.carelyo.v1.dto.ValidationMessages;
import com.carelyo.v1.dto.consultation.SbarDTO;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity(name = "consultation_sbar")
public class ConsultationSBAR {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(length = 1500)
  @Size(max = 1500, message = ValidationMessages.INVALID_FIELD_SIZE)
  private String situation;
  @Column(length = 1500)
  @Size(max = 1500, message = ValidationMessages.INVALID_FIELD_SIZE)
  private String background;
  @Column(length = 1500)
  @Size(max = 1500, message = ValidationMessages.INVALID_FIELD_SIZE)
  private String assessment;
  @Column(length = 1500)
  @Size(max = 1500, message = ValidationMessages.INVALID_FIELD_SIZE)
  private String recommendation;
  @Column(length = 1500)
  @Size(max = 1500, message = ValidationMessages.INVALID_FIELD_SIZE)
  private String notes;
  @Column(length = 1500)
  @Size(max = 1500, message = ValidationMessages.INVALID_FIELD_SIZE)
  private String diagnosis;

  public ConsultationSBAR(SbarDTO sbarDTO) {
    this.situation = sbarDTO.getSituation();
    this.background = sbarDTO.getBackground();
    this.assessment = sbarDTO.getAssessment();
    this.recommendation = sbarDTO.getRecommendation();
    this.notes = sbarDTO.getNotes();
    this.diagnosis = sbarDTO.getDiagnosis();
  }


}