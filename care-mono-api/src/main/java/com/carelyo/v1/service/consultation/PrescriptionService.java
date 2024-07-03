package com.carelyo.v1.service.consultation;

import com.carelyo.v1.dto.summary.PrescriptionDTO;
import com.carelyo.v1.dto.summary.PrescriptionFormDTO;
import com.carelyo.v1.enums.EConsultationStatus;
import com.carelyo.v1.model.consultation.Consultation;
import com.carelyo.v1.model.summary.Prescription;
import com.carelyo.v1.model.user.child.Child;
import com.carelyo.v1.model.user.patient.Patient;
import com.carelyo.v1.repos.summary.PrescriptionRepository;
import com.carelyo.v1.service.child.ChildService;
import com.carelyo.v1.service.patient.PatientService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.user.UserService;
import com.carelyo.v1.utils.ModelSorter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
public class PrescriptionService {

  PrescriptionRepository prescriptionRepository;
  ConsultationService consultationService;
  UserService userService;
  ChildService childService;
  PatientService patientService;

  public List<Prescription> getAllPrescriptions() {
    return new ArrayList<>(prescriptionRepository.findAll());
  }

  public Prescription createPrescription(
      PrescriptionFormDTO.PrescriptionFormRequest prescriptionFormDTO, Long doctorId) {

    Consultation consultation = consultationService.getConsultation(
        prescriptionFormDTO.getConsultationId());

    if (!Objects.equals(consultation.getDoctorId(), doctorId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "Not Allowed to perform this action");
    }

    Prescription prescription = new Prescription(prescriptionFormDTO);
    prescription.setDoctorId(doctorId);
    prescription.setIssuerName(consultation.getDoctorFullName());
    prescription.setIssueDate(LocalDateTime.now());
    prescription.setRecipientName(consultation.getPatientFullName());
    prescription.setPatientId(consultation.getPatientId());
    if (consultation.isChild()) {
      prescription.setChildId(consultation.getChildId());
    }

    try {
      prescription = prescriptionRepository.save(prescription);

      return prescription;
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
          "failed to save prescription");
    }
  }

  public Prescription getPrescriptionById(Long id) {
    if (prescriptionRepository.findById(id).isPresent()) {
      return prescriptionRepository.findById(id).get();
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "prescription not found");
  }

  public List<Prescription> getPrescriptionByConsultationIdAndPatientId(Long consultationId,
      Long patientId) {
    Consultation consultation = consultationService.getById(consultationId).orElse(null);
    List<Prescription> prescriptions;
    if(consultation != null && consultation.isChild()) {
      prescriptions = prescriptionRepository.findByConsultationIdAndChildId(
          consultationId,
           consultation.getChildId());
    } else {
      prescriptions = prescriptionRepository.findByConsultationIdAndPatientIdAndChildId(
          consultationId,
          patientId, null);
    }
    return new ModelSorter<>(prescriptions).sortModelByTimeCreated();
  }

  public List<Prescription> getPrescriptionByConsultationIdAndChildId(Long consultationId,
      Long childId) {
    List<Prescription> prescriptions = prescriptionRepository.findByConsultationIdAndChildId(
        consultationId, childId);
    return new ModelSorter<>(prescriptions).sortModelByTimeCreated();
  }

  public Optional<Prescription> getPrescriptionByConsultationId(Long consultationId) {

    return prescriptionRepository.findByConsultationId(consultationId);

  }

  public void fulfilPrescription(Long id, Long patientId) {
    if (prescriptionRepository.findByIdAndPatientId(id, patientId).isPresent()) {
      Prescription prescription = prescriptionRepository.findByIdAndPatientId(id, patientId)
          .get();
      prescription.setStatus("fulfilled");
      prescription.setFulfilledDate(LocalDateTime.now());
      prescriptionRepository.save(prescription);
    }
  }

  public Prescription updatePrescription(Long id,
      PrescriptionFormDTO.UpdatePrescriptionFormRequest prescriptionFormDTO, Long doctorId) {
    Prescription prescription = getPrescriptionById(id);
    Consultation consultation = consultationService.getConsultation(
        prescription.getConsultationId());

    if (!Objects.equals(consultation.getDoctorId(), doctorId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "Not Allowed to perform this action");
    }

    if (consultation.getStatus().equals(EConsultationStatus.finished)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "Not Allowed to perform this action");
    }

    prescription.setDosage(prescriptionFormDTO.getDosage());
    prescription.setFrequency(prescriptionFormDTO.getFrequency());
    prescription.setIllness(prescriptionFormDTO.getIllness());
    prescription.setQuantity(prescriptionFormDTO.getQuantity());
    prescription.setMedicationName(prescriptionFormDTO.getMedicationName());
    prescription.setMedicationType(prescriptionFormDTO.getMedicationType());
    prescription.setMedicationStrength(prescriptionFormDTO.getMedicationStrength());
    prescription.setTreatmentDuration(prescriptionFormDTO.getTreatmentDuration());
    prescriptionRepository.save(prescription);

    return prescription;
  }

  public List<PrescriptionDTO> getAllPrescriptionsByPatientId(Long patientId) {
    UserDetailsImpl userDetail = UserDetailsImpl.build(userService.getUserById(patientId));
    List<Prescription> prescriptions = prescriptionRepository.findAllByPatientIdAndChildId(
        patientId, null);
    List<Long> childList = childService.getActiveChildren(userDetail).stream().map(Child::getId)
        .collect(Collectors.toList());
    prescriptions.addAll(prescriptionRepository.findAllByChildIdIn(childList));

    return prescriptions.stream()
        .map(prescription -> {
          String patientName;
          if (prescription.getChildId() != null) {
            patientName = childService.getChildById(prescription.getChildId())
                .map(Child::getName)
                .orElse(null);
          } else {
            Patient patient = patientService.getPatientByUserId(prescription.getPatientId());
            patientName = patient.getFirstName() + " " + patient.getSurName();
          }
          PrescriptionDTO dto = prescription.getDTO();
          return new PrescriptionDTO(dto.getId(),
              dto.getIssueDate(),
              dto.getIssuerName(),
              dto.getDosage(),
              dto.getFrequency(),
              dto.getIllness(),
              dto.getQuantity(),
              dto.getMedicationName(),
              dto.getMedicationType(),
              dto.getMedicationStrength(),
              dto.getTreatmentDuration(),
              dto.getStatus(),
              dto.getConsultationId(),
              patientName,
              dto.getRecipientName());
        })
        .collect(Collectors.toList());
  }
}