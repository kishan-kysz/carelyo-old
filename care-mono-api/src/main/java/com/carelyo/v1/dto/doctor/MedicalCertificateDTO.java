package com.carelyo.v1.dto.doctor;

import com.carelyo.v1.model.user.doctor.MedicalCertificate;
import lombok.Value;

public class MedicalCertificateDTO {

  @Value
  public static class UpdateMedicalCertificate {

    MedicalCertificate medicalCertificate;

    public UpdateMedicalCertificate(MedicalCertificate medicalCertificate) {
      this.medicalCertificate = medicalCertificate;
    }
  }
}
