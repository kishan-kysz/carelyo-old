package com.carelyo.v1.service.consultation;

import com.carelyo.v1.dto.summary.ConsultationSummaryDTO;
import com.carelyo.v1.dto.summary.FollowUpDTO;
import com.carelyo.v1.dto.summary.LabrequestDTO.OngoingLabDTO;
import com.carelyo.v1.dto.summary.PrescriptionDTO;
import com.carelyo.v1.dto.summary.ReceiptDTO;
import com.carelyo.v1.enums.EConsultationStatus;
import com.carelyo.v1.model.consultation.Consultation;
import com.carelyo.v1.model.consultation.ConsultationSBAR;
import com.carelyo.v1.model.summary.FollowUp;
import com.carelyo.v1.model.summary.Labrequest;
import com.carelyo.v1.model.summary.Prescription;
import com.carelyo.v1.model.user.child.Child;
import com.carelyo.v1.model.user.doctor.Doctor;
import com.carelyo.v1.model.user.patient.Patient;
import com.carelyo.v1.service.child.ChildService;
import com.carelyo.v1.service.doctor.DoctorService;
import com.carelyo.v1.service.patient.PatientService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.user.UserService;
import com.carelyo.v1.utils.ModelSorter;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SummaryService {

  private final ConsultationService consultationService;
  private final PatientService patientService;
  private final LabrequestService labrequestService;
  private final PrescriptionService prescriptionService;
  private final FollowUpService followUpService;
  private final DoctorService doctorService;
  private final ChildService childService;
  private final UserService userService;

  public SummaryService(ConsultationService consultationService,
      PatientService patientService,
      LabrequestService labrequestService, PrescriptionService prescriptionService,
      FollowUpService followUpService,
      DoctorService doctorService, ChildService childService, UserService userService) {
    this.consultationService = consultationService;
    this.patientService = patientService;
    this.labrequestService = labrequestService;
    this.prescriptionService = prescriptionService;
    this.followUpService = followUpService;
    this.doctorService = doctorService;
    this.childService = childService;
    this.userService = userService;
  }


  public ReceiptDTO getReceipt(Long consultationId, Long patientId) {
    if (consultationService.getByIdAndPatientId(consultationId, patientId).isPresent()) {
      Consultation consultation = consultationService.getByIdAndPatientId(consultationId,
          patientId).get();
      if (!Objects.equals(consultation.getStatus(), EConsultationStatus.finished)) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
            "Consultation is not finished yet");
      }
      String doctorHospital = doctorService.getById(consultation.getDoctorId())
          .map(Doctor::getHospital).orElse(null);
      String patientNationalId = patientService.getPatientById(consultation.getPatientId())
          .map(Patient::getNationalIdNumber).orElse(null);

      return new ReceiptDTO(
          consultation.getPatientFullName(),
          patientNationalId,
          doctorHospital,
          consultation.getAmountPaid(),
          consultation.getTimeAccepted(),
          consultation.getTimeFinished()
      );

    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND,
        "Consultation id could not be found");
  }

  public ReceiptDTO getReceipt(Long consultationId) {
    Consultation consultation = consultationService.getById(consultationId).get();
    if (!Objects.equals(consultation.getStatus(), EConsultationStatus.finished)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "Consultation is not finished yet");
    }

    String patientName;
    String doctorHospital = doctorService.getById(consultation.getDoctorId())
        .map(Doctor::getHospital).orElse(null);
    ;
    String patientNationalId;
    if (consultation.isChild()) {
      patientName = childService.getChildById(consultation.getChildId()).map(Child::getName)
          .orElse(null);
      patientNationalId = patientService.getPatientById(consultation.getPatientId())
          .map(Patient::getNationalIdNumber).orElse(null);
    } else {
      patientName = consultation.getPatientFullName();
      patientNationalId = patientService.getPatientById(consultation.getPatientId())
          .map(Patient::getNationalIdNumber).orElse(null);
    }
    return new ReceiptDTO(
        patientName,
        patientNationalId,
        doctorHospital,
        consultation.getAmountPaid(),
        consultation.getTimeAccepted(),
        consultation.getTimeFinished()
    );
  }


  public ConsultationSummaryDTO getConsultationSummary(Long consultationId, Long patientId,
      UserDetailsImpl userDetails
  ) {

    if (consultationService.getByIdAndPatientId(consultationId, patientId).isPresent()) {
      Consultation consultation = consultationService.getByIdAndPatientId(consultationId,
          patientId).get();

      if (!Objects.equals(consultation.getStatus(),
          EConsultationStatus.finished)) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
            "Consultation is not finished yet");
      }
      List<Labrequest> labrequestDTO = labrequestService.getLabsByConsultationIdAndPatientId(
          consultationId, patientId);
      List<Prescription> prescriptionDTO = prescriptionService.getPrescriptionByConsultationIdAndPatientId(
          consultationId, patientId);
      Optional<FollowUp> followUp = followUpService.getByConsultationId(consultation.getId());

      // Different SBAR if patient or doctor
      ConsultationSBAR autzSBAR;
      if (userDetails.getAuthorities().stream().anyMatch(r -> r.getAuthority().equals("PATIENT"))) {
        autzSBAR = SBARForPatient(consultation);
      } else {
        autzSBAR = consultation.getSbar();
      }
      String patientName;
      if (consultation.isChild()) {
        patientName = childService.getChildById(consultation.getChildId()).map(Child::getName)
            .orElse(null);
      } else {
        patientName = consultation.getPatientFullName();
      }
      return new ConsultationSummaryDTO(
          consultationId,
          consultation.getSymptoms(),
          consultation.getRelatedSymptoms(),
          consultation.getSbar().getDiagnosis(),
          consultation.getDoctorFullName(),
          consultation.getTimeFinished(),
          prescriptionDTO.stream().map(Prescription::getDTO).collect(Collectors.toList()),
          labrequestDTO.stream().map(Labrequest::getLabDTO).collect(Collectors.toList()),
          followUp.map(FollowUp::getFullDTO).orElse(null),
          autzSBAR,
          patientName
      );
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND,
        "Consultation id could not be found");

  }

  public ConsultationSummaryDTO getConsultationSummaryById(Long consultationId,
      UserDetailsImpl userDetails) {

    Consultation consultation = consultationService.getById(consultationId).orElse(null);

    if (!Objects.equals(consultation.getStatus(),
        EConsultationStatus.finished)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "Consultation is not finished yet");
    }
    String patientName;
    List<Labrequest> labrequestDTO;
    List<Prescription> prescriptionDTO;
    Optional<FollowUp> followUp;
    ConsultationSBAR autzSBAR;
    if (consultation.isChild()) {
      labrequestDTO = labrequestService.getLabsByConsultationIdAndChildId(
          consultationId, consultation.getChildId());
      prescriptionDTO = prescriptionService.getPrescriptionByConsultationIdAndChildId(
          consultationId, consultation.getChildId());
      followUp = followUpService.getByConsultationId(consultation.getId());

      // Different SBAR if patient or doctor
      if (userDetails.getAuthorities().stream().anyMatch(r -> r.getAuthority().equals("PATIENT"))) {
        autzSBAR = SBARForPatient(consultation);
      } else {
        autzSBAR = consultation.getSbar();
      }
      patientName = childService.getChildById(consultation.getChildId()).map(Child::getName)
          .orElse(null);
    } else {
      labrequestDTO = labrequestService.getLabsByConsultationIdAndPatientId(
          consultationId, userDetails.getId());
      prescriptionDTO = prescriptionService.getPrescriptionByConsultationIdAndPatientId(
          consultationId, userDetails.getId());
      followUp = followUpService.getByConsultationId(consultation.getId());

      // Different SBAR if patient or doctor
      if (userDetails.getAuthorities().stream().anyMatch(r -> r.getAuthority().equals("PATIENT"))) {
        autzSBAR = SBARForPatient(consultation);
      } else {
        autzSBAR = consultation.getSbar();
      }
      patientName = consultation.getPatientFullName();
    }
    return new ConsultationSummaryDTO(
        consultationId,
        consultation.getSymptoms(),
        consultation.getRelatedSymptoms(),
        consultation.getSbar().getDiagnosis(),
        consultation.getDoctorFullName(),
        consultation.getTimeFinished(),
        prescriptionDTO.stream().map(Prescription::getDTO).collect(Collectors.toList()),
        labrequestDTO.stream().map(Labrequest::getLabDTO).collect(Collectors.toList()),
        followUp.map(FollowUp::getFullDTO).orElse(null),
        autzSBAR,
        patientName
    );
  }

  private ConsultationSBAR SBARForPatient(Consultation consultation) {
    ConsultationSBAR modifiedSBAR = consultation.getSbar();
    modifiedSBAR.setNotes("");
    return modifiedSBAR;
  }

  public List<ConsultationSummaryDTO> getAllConsultationSummaryByPatientId(Long patientId, Boolean isChild, Long childId) {
    List<Consultation> consultations = new java.util.ArrayList<>(List.of());
    if (isChild) {
      consultations.addAll(new ModelSorter<>(
          consultationService.getAllByChildIdAndStatus(
              childId, EConsultationStatus.finished)).sortModelByTimeCreated());
    } else {
      consultations.addAll(new ModelSorter<>(
          consultationService.getAllByPatientIdAndStatusAndIsChildFalse(
              patientId, EConsultationStatus.finished)).sortModelByTimeCreated());
    }
    return consultations.stream().map(consultation -> {
      List<Labrequest> labRequestDTO;
      List<Prescription> prescriptionDTO;
      String patientName;
      if (consultation.isChild()) {
        labRequestDTO = labrequestService.getLabsByConsultationIdAndChildId(
            consultation.getId(), consultation.getChildId());
        prescriptionDTO = prescriptionService.getPrescriptionByConsultationIdAndChildId(
            consultation.getId(), consultation.getChildId());
        patientName = childService.getChildById(consultation.getChildId()).map(Child::getName)
            .orElse(null);
      } else {
        labRequestDTO = labrequestService.getLabsByConsultationIdAndPatientId(
            consultation.getId(), patientId);
        prescriptionDTO = prescriptionService.getPrescriptionByConsultationIdAndPatientId(
            consultation.getId(), patientId);
        patientName = consultation.getPatientFullName();
      }
      Optional<FollowUp> followUp = followUpService.getByConsultationId(consultation.getId());
      FollowUpDTO followUpDTO = followUp.map(FollowUp::getFullDTO).orElse(null);
      FollowUpDTO newFollowUpDTO = null;
      if (followUpDTO != null) {
        newFollowUpDTO = new FollowUpDTO(followUpDTO.getId(),
            followUpDTO.getPrice(),
            followUpDTO.getPurpose(),
            followUpDTO.getLocation(),
            followUpDTO.getStatus(),
            followUpDTO.getFollowUpDate(),
            followUpDTO.getCreatedAt(),
            followUpDTO.getUpdatedAt(),
            consultation.getDoctorFullName(),
            patientName
        );
      }

      return new ConsultationSummaryDTO(
          consultation.getId(),
          consultation.getSymptoms(),
          consultation.getRelatedSymptoms(),
          consultation.getSbar().getDiagnosis(),
          consultation.getDoctorFullName(),
          consultation.getTimeFinished(),
          prescriptionDTO.stream().map(Prescription::getDTO).collect(Collectors.toList()),
          labRequestDTO.stream().map(Labrequest::getLabDTO).collect(Collectors.toList()),
          newFollowUpDTO,
          consultation.getSbar(),
          patientName
      );
    }).collect(Collectors.toList());
  }

  public List<ConsultationSummaryDTO> getAllConsultationSummaryByPatientId(Long patientId) {
    UserDetailsImpl userDetail = UserDetailsImpl.build(userService.getUserById(patientId));
    List<Long> childList = childService.getActiveChildren(userDetail).stream().map(Child::getId)
        .collect(Collectors.toList());
    List<Consultation> consultations = new ModelSorter<>(
        consultationService.getAllByPatientIdAndStatusAndIsChildFalse(
            patientId, EConsultationStatus.finished)).sortModelByTimeCreated();
    consultations.addAll(new ModelSorter<>(
        consultationService.getAllInChildIdAndStatus(
            childList, EConsultationStatus.finished)).sortModelByTimeCreated());
    return consultations.stream().map(consultation -> {
      List<Labrequest> labRequestDTO = labrequestService.getLabsByConsultationIdAndPatientId(
          consultation.getId(), patientId);
      List<Prescription> prescriptionDTO = prescriptionService.getPrescriptionByConsultationIdAndPatientId(
          consultation.getId(), patientId);
      Optional<FollowUp> followUp = followUpService.getByConsultationId(consultation.getId());
      String patientName;
      if (consultation.isChild()) {
        patientName = childService.getChildById(consultation.getChildId()).map(Child::getName)
            .orElse(null);
      } else {
        patientName = consultation.getPatientFullName();
      }
      FollowUpDTO followUpDTO = followUp.map(FollowUp::getFullDTO).orElse(null);
      FollowUpDTO newFollowUpDTO = null;
      if (followUpDTO != null) {
        newFollowUpDTO = new FollowUpDTO(followUpDTO.getId(),
            followUpDTO.getPrice(),
            followUpDTO.getPurpose(),
            followUpDTO.getLocation(),
            followUpDTO.getStatus(),
            followUpDTO.getFollowUpDate(),
            followUpDTO.getCreatedAt(),
            followUpDTO.getUpdatedAt(),
            consultation.getDoctorFullName(),
            patientName
        );
      }

      return new ConsultationSummaryDTO(
          consultation.getId(),
          consultation.getSymptoms(),
          consultation.getRelatedSymptoms(),
          consultation.getSbar().getDiagnosis(),
          consultation.getDoctorFullName(),
          consultation.getTimeFinished(),
          prescriptionDTO.stream().map(Prescription::getDTO).collect(Collectors.toList()),
          labRequestDTO.stream().map(Labrequest::getLabDTO).collect(Collectors.toList()),
          newFollowUpDTO,
          consultation.getSbar(),
          patientName
      );
    }).collect(Collectors.toList());
  }

  public CurrentSummary getCurrentSummary(Long consultationId) {
    Consultation consultation = consultationService.getConsultation(consultationId);
    if (consultation != null) {
      List<Labrequest> labrequestDTO;
      List<Prescription> prescriptionDTO;
      if(consultation.isChild()) {
        labrequestDTO = labrequestService.getLabsByConsultationIdAndChildId(
            consultationId, consultation.getChildId());
        prescriptionDTO = prescriptionService.getPrescriptionByConsultationIdAndChildId(
            consultationId, consultation.getChildId());
      } else {
        labrequestDTO = labrequestService.getLabsByConsultationIdAndPatientId(
            consultationId, consultation.getPatientId());
        prescriptionDTO = prescriptionService.getPrescriptionByConsultationIdAndPatientId(
            consultationId, consultation.getPatientId());
      }
      Optional<FollowUp> followUp = followUpService.getByConsultationId(consultationId);
      return new CurrentSummary(
          prescriptionDTO.stream().map(Prescription::getDTO).collect(Collectors.toList()),
          labrequestDTO.stream().map(Labrequest::getOngoingLabDTO)
              .collect(Collectors.toList()),
          followUp.map(FollowUp::getFullDTO).orElse(null)
      );
    }
    return null;
  }

  @Value
  public static class CurrentSummary {
    List<PrescriptionDTO> prescriptions;
    List<OngoingLabDTO> labs;
    FollowUpDTO followUp;
  }
}
