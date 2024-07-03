package com.carelyo.v1.repos.summary;

import com.carelyo.v1.model.summary.Prescription;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Prescription repository
 */
@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

  Optional<Prescription> findByIdAndPatientId(Long id, Long patientId);

  Optional<Prescription> findByConsultationId(Long id);

  List<Prescription> findByConsultationIdAndPatientId(Long consultationId, Long patientId);

  List<Prescription> findByConsultationIdAndPatientIdAndChildId(Long consultationId, Long patientId, Long childId);

  List<Prescription> findByConsultationIdAndChildId(Long consultationId, Long childId);

  Optional<List<Prescription>> findAllByConsultationId(Long consultationId);

  List<Prescription> findAllByPatientId(Long patientId);

  List<Prescription> findAllByPatientIdAndChildId(Long patientId, Long childId);

  List<Prescription> findAllByChildIdIn(List<Long> childIds);
}
