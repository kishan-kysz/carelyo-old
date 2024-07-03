package com.carelyo.v1.repos.summary;

import com.carelyo.v1.model.summary.Labrequest;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


/**
 * Labrequest repository
 */
@Repository
public interface LabrequestRepository extends JpaRepository<Labrequest, Long> {

  List<Labrequest> findByPatientId(Long patientId);

  List<Labrequest> findByConsultationIdAndPatientId(Long consultationId, Long patientId);

  List<Labrequest> findByConsultationIdAndPatientIdAndChildId(Long consultationId, Long patientId, Long childId);

  List<Labrequest> findByConsultationIdAndChildId(Long consultationId, Long childId);

  Optional<Labrequest> findByConsultationId(Long consultationId);

}
