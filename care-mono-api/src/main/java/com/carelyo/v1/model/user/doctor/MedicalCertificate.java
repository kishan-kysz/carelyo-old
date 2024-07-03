package com.carelyo.v1.model.user.doctor;


import com.carelyo.v1.dto.ValidationMessages;
import com.carelyo.v1.dto.doctor.MedicalCertificateDTO.UpdateMedicalCertificate;
import java.io.Serializable;
import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
public class MedicalCertificate implements Serializable {

  @Column(unique = true)
  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  private String certificateNumber;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  private LocalDateTime issuedDate;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  private LocalDateTime expirationDate;

  public MedicalCertificate(String certificateNumber, LocalDateTime issuedDate,
      LocalDateTime expirationDate) {
    this.certificateNumber = certificateNumber;
    this.issuedDate = issuedDate;
    this.expirationDate = expirationDate;
  }

  public MedicalCertificate(UpdateMedicalCertificate dto) {
    this.certificateNumber = dto.getMedicalCertificate().getCertificateNumber();
    this.issuedDate = dto.getMedicalCertificate().getIssuedDate();
    this.expirationDate = dto.getMedicalCertificate().getExpirationDate();
  }
}
