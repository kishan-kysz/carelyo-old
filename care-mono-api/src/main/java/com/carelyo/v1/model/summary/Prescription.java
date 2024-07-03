package com.carelyo.v1.model.summary;

import com.carelyo.v1.dto.summary.PrescriptionDTO;
import com.carelyo.v1.dto.summary.PrescriptionFormDTO;
import com.carelyo.v1.model.BaseModel;
import java.time.LocalDateTime;
import java.util.Comparator;
import javax.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Prescription extends BaseModel {

  public static Comparator<Prescription> dateComparator = Comparator.comparing(
      Prescription::getIssueDate);

  private Long consultationId;
  private Long patientId;
  private Long doctorId;
  private String recipientName;
  private LocalDateTime issueDate;
  private String dosage;
  private String frequency;
  private String illness;
  private String medicationName;
  private String quantity;
  private String medicationStrength;
  private String medicationType;
  private String treatmentDuration;
  private String withdrawals;
  private String amountPerWithdrawal;
  private String issuerName;
  private LocalDateTime fulfilledDate;
  /*    @Lob
      private byte[] qrCode;
      private Boolean filled;
      private Long pharmacyId;
      private Boolean flagged;
      private String pharmacistRemark;
      private String productBarcode;*/
  private String status;
  private Long childId;

  public Prescription(PrescriptionFormDTO.PrescriptionFormRequest prescriptionFormDTO) {
    this.consultationId = prescriptionFormDTO.getConsultationId();
    this.dosage = prescriptionFormDTO.getDosage();
    this.frequency = prescriptionFormDTO.getFrequency();
    this.illness = prescriptionFormDTO.getIllness();
    this.quantity = prescriptionFormDTO.getQuantity();
    this.medicationName = prescriptionFormDTO.getMedicationName();
    this.medicationType = prescriptionFormDTO.getMedicationType();
    this.medicationStrength = prescriptionFormDTO.getMedicationStrength();
    this.treatmentDuration = prescriptionFormDTO.getTreatmentDuration();
    this.status = "submitted";
  }

  public PrescriptionDTO getDTO() {
    return new PrescriptionDTO(
        this.getId(),
        this.issueDate,
        this.issuerName,
        this.dosage,
        this.frequency,
        this.illness,
        this.quantity,
        this.medicationName,
        this.medicationType,
        this.medicationStrength,
        this.treatmentDuration,
        this.status,
        this.consultationId,
        null,
        this.recipientName
    );
  }

}
