package com.carelyo.v1.repos.child;

import com.carelyo.v1.enums.EChildStatus;
import com.carelyo.v1.model.user.child.Child;
import com.carelyo.v1.model.user.Partner;
import com.carelyo.v1.model.user.patient.Patient;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ChildRepository extends JpaRepository<Child, Long> {

  List<Child> findByPatientOrPartnerPatient(Patient patient, Patient partnerPatient);

  @Query("SELECT c FROM Child c WHERE c.status = :status AND (c.patient = :patient OR c.partnerPatient = :partnerPatient)")
  List<Child> findByStatusAndPatientOrPartnerPatient(EChildStatus status, Patient patient, Patient partnerPatient);

  List<Child> findByPartner(Partner partner);

  @Transactional
  @Modifying
  @Query("UPDATE Child c SET c.partnerPatient = :partnerPatient, c.partner = null WHERE c.id in :ids")
  void updatePartnerPatientInId(Patient partnerPatient, List<Long> ids);

}
