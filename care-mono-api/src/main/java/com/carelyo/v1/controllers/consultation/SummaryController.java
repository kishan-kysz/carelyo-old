package com.carelyo.v1.controllers.consultation;

import com.carelyo.v1.dto.summary.ConsultationSummaryDTO;
import com.carelyo.v1.dto.summary.FollowUpDTO;
import com.carelyo.v1.dto.summary.LabrequestDTO;
import com.carelyo.v1.dto.summary.PrescriptionDTO;
import com.carelyo.v1.dto.summary.ReceiptDTO;
import com.carelyo.v1.model.summary.Labrequest;
import com.carelyo.v1.model.summary.Prescription;
import com.carelyo.v1.service.consultation.FollowUpService;
import com.carelyo.v1.service.consultation.LabrequestService;
import com.carelyo.v1.service.consultation.PrescriptionService;
import com.carelyo.v1.service.consultation.SummaryService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.utils.AppUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@Tag(name = "Summary", description = "`PATIENT`")
@RequestMapping("/api/v1/consultations/summary")
public class SummaryController {

  private final SummaryService summaryService;
  private final PrescriptionService prescriptionService;
  private final FollowUpService followUpService;

  private final LabrequestService labrequestService;

  public SummaryController(SummaryService summaryService, PrescriptionService prescriptionService,
      FollowUpService followUpService, LabrequestService labrequestService) {
    this.summaryService = summaryService;
    this.prescriptionService = prescriptionService;
    this.followUpService = followUpService;
    this.labrequestService = labrequestService;

  }

  @Operation(summary = "Get labrequest by consultationId", description = "**Roles:**`PATIENT``DOCTOR` `SYSTEMADMIN`")
  @GetMapping("/labrequest/{consultationId}")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('DOCTOR')")
  public ResponseEntity<List<LabrequestDTO>> getLabrequestByConsultationId(
      @PathVariable Long consultationId, @RequestParam(required = false) Long patientId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
//    Long targetId = AppUtils.enforceTargetIdIfAdminOrDoctor(patientId, userDetails);
    return ResponseEntity.status(HttpStatus.OK)
        .body(labrequestService.getLabrequestByConsultationId(consultationId)
            .stream()
            .map(Labrequest::getLabDTO)
            .collect(Collectors.toList()));

  }

  @Operation(summary = "Get receipt by consultationId", description = "**Roles:**`PATIENT` `DOCTOR`")
  @GetMapping("/receipt/{consultationId}")
  @PreAuthorize("hasAuthority('PATIENT')")
  public ResponseEntity<ReceiptDTO> getReceipt(@PathVariable Long consultationId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
//    ReceiptDTO receiptDTO = summaryService.getReceipt(consultationId, userDetails.getId());
    ReceiptDTO receiptDTO = summaryService.getReceipt(consultationId);
    return ResponseEntity.status(HttpStatus.OK).body(receiptDTO);
  }

  @Operation(summary = "Get follow up by consultationId", description = "**Roles:**`PATIENT`")
  @GetMapping("/followup/{consultationId}")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('DOCTOR')")
  public ResponseEntity<FollowUpDTO> getFollowUp(@PathVariable Long consultationId,
      @RequestParam(required = false) Long patientId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long targetId = AppUtils.enforceTargetIdIfAdminOrDoctor(patientId, userDetails);
    return ResponseEntity.status(HttpStatus.OK)
        .body(followUpService.getFollowUpByConsultationIdAndPatientId(consultationId, targetId)
            .getFullDTO());
  }

  @Operation(summary = "Get prescription by consultationId", description = "**Roles:**`PATIENT`")
  @GetMapping("/prescription/{consultationId}")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('DOCTOR')")
  public ResponseEntity<List<PrescriptionDTO>> getPrescription(@PathVariable Long consultationId,
      @RequestParam(required = false) Long patientId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long targetId = AppUtils.enforceTargetIdIfAdminOrDoctor(patientId, userDetails);
    List<Prescription> prescription = prescriptionService.getPrescriptionByConsultationIdAndPatientId(
        consultationId, targetId);
    return ResponseEntity.status(HttpStatus.OK)
        .body(prescription.stream().map(Prescription::getDTO).collect(Collectors.toList()));

  }

  @Operation(summary = "Get Consultation by consultationId", description = "**Roles:**`PATIENT``DOCTOR` `SYSTEMADMIN`")
  @GetMapping("/{consultationId}")
  @PreAuthorize("hasAuthority('PATIENT')or hasAuthority('DOCTOR')")
  public ResponseEntity<ConsultationSummaryDTO> getConsultation(@PathVariable Long consultationId,
      @RequestParam(required = false) Long patientId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long targetId = AppUtils.enforceTargetIdIfAdminOrDoctor(patientId, userDetails);
//    ConsultationSummaryDTO consultationSummaryDTO = summaryService.getConsultationSummary(
//        consultationId, targetId, userDetails);
    ConsultationSummaryDTO consultationSummaryDTO = summaryService.getConsultationSummaryById(
        consultationId, userDetails);
    return ResponseEntity.status(HttpStatus.OK).body(consultationSummaryDTO);
  }

  @Operation(summary = "Get all user consultation summary", description = "**Roles:**`PATIENT``DOCTOR` `SYSTEMADMIN`")
  @GetMapping("/all/{patientId}")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('SYSTEMADMIN') or hasAuthority('DOCTOR')")
  public ResponseEntity<List<ConsultationSummaryDTO>> getAllConsultationSummary(
      @PathVariable(name = "patientId") Long id,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    // if user is admin use the id from the request
    Long targetId = AppUtils.enforceTargetIdIfAdminOrDoctor(id, userDetails);
    if (targetId == null) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to access this resource");
    }
    return ResponseEntity.status(HttpStatus.OK)
        .body(summaryService.getAllConsultationSummaryByPatientId(targetId));
  }

}