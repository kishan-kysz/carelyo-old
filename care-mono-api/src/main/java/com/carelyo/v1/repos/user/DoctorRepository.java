package com.carelyo.v1.repos.user;

import com.carelyo.v1.model.user.doctor.Doctor;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

  Optional<Doctor> findByUserId(Long id);

  Optional<Doctor> findByMedicalCertificate_CertificateNumber(String CertificateNumber);

  Optional<Doctor> findByNationalIdNumber(Long nationalIdentificationNumber);

  @Query("select d from Doctor d where d.nationalIdNumber = ?1 or d.medicalCertificate.certificateNumber = ?2")
  Optional<Doctor> findByNationalIdNumberOrMdcn(Long nationalIdentificationNumber,
      String MDCNCertificateNumber);

  Optional<Doctor> findByStudentIdNumber(String studentIdNumber);
}
