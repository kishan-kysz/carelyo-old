package com.carelyo.v1.repos.consultation;

import com.carelyo.v1.enums.EConsultationStatus;
import com.carelyo.v1.model.consultation.Consultation;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

  Optional<Consultation> findByIdAndDoctorId(Long id, Long doctorId);


  Optional<Consultation> findByRoomName(String roomName);

  Optional<Consultation> findByIdAndPatientId(Long id, Long patientId);

  List<Consultation> findAllByDoctorId(Long doctorId);

  Optional<Consultation> findByTransactionReference(String transactionReference);

  List<Consultation> findAllByPatientIdAndStatus(Long patientId, EConsultationStatus status);

  List<Consultation> findAllByPatientIdAndStatusAndIsChild(Long patientId, EConsultationStatus status, Boolean isChild);

  List<Consultation> findAllByChildIdInAndStatus(List<Long> childIds, EConsultationStatus status);

  List<Consultation> findAllByChildIdAndStatus(Long childId, EConsultationStatus status);

  Optional<List<Consultation>> findAllByTimeFinishedBetween(long startDate, long endDate);

  Optional<List<Consultation>> findAllByTimeBookedBetween(
      LocalDateTime startDate, LocalDateTime endDate);

  Optional<List<Consultation>> findAllByStatus(EConsultationStatus status);

  @Query("SELECT c FROM Consultation c WHERE (c.patientId = :userId OR c.doctorId = :userId) AND c.status IN :status")
  Optional<Consultation> findActiveConsultation(Long userId, List<EConsultationStatus> status);

  List<Consultation> findAllByStatus(EConsultationStatus status, Sort sort);

  Optional<List<Consultation>> findAllByStatusAndDoctorId(EConsultationStatus status, Long id);

  @Query("SELECT c FROM Consultation c WHERE c.patientId = :userId AND c.status = 'FINISHED' AND c.rating IS NULL")
  List<Consultation> findUnratedConsultation(Long userId);
}
