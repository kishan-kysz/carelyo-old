package com.carelyo.v1.dto.admin;

import com.carelyo.v1.model.user.doctor.MedicalCertificate;
import java.time.LocalDateTime;
import javax.persistence.Embedded;
import lombok.Value;

@Value
public class DoctorUserResponseDTO {

  Long userId;
  String email;
  String mobile;
  String firstName;
  String lastName;
  @Embedded
  MedicalCertificate medicalCertificate;
  String hospital;
  Long nationalIdNumber;
  LocalDateTime createdAt;
  LocalDateTime updatedAt;

}