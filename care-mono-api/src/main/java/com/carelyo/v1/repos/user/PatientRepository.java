package com.carelyo.v1.repos.user;

import com.carelyo.v1.model.user.patient.Patient;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Patient repository
 */
@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

  Optional<Patient> findByUserId(Long userId);
  Optional<Patient> findByNationalIdNumber(String nationalId);
}
