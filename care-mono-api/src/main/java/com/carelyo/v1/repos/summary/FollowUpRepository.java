package com.carelyo.v1.repos.summary;

import com.carelyo.v1.model.summary.FollowUp;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowUpRepository extends JpaRepository<FollowUp, Long> {

  Optional<FollowUp> findByConsultationId(Long originConsultationId);

  Optional<FollowUp> findByConsultationIdAndPatientId(Long originConsultationId, Long patientId);

  Optional<FollowUp> findByIdAndDoctorId(Long id, Long doctorId);
}
