package com.carelyo.v1.controllers.consultation;

import com.carelyo.v1.dto.summary.PrescriptionDTO;
import com.carelyo.v1.dto.summary.PrescriptionFormDTO;
import com.carelyo.v1.model.summary.Prescription;
import com.carelyo.v1.service.consultation.PrescriptionService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.utils.AppUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Prescriptions", description = "`DOCTOR` `PATIENT`")
@RequestMapping("/api/v1/consultations")
public class PrescriptionController {

  private final PrescriptionService prescriptionService;

  public PrescriptionController(PrescriptionService prescriptionService) {
    this.prescriptionService = prescriptionService;
  }

  @Tag(name = "Admin")
  @Operation(summary = "Get all prescriptions", description = "**Role:** `SYSTEMADMIN`")
  @GetMapping("/prescriptions")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<PrescriptionDTO>> getAllPrescriptions() {
    return ResponseEntity.ok().body(prescriptionService.getAllPrescriptions().stream()
        .map(Prescription::getDTO)
        .collect(Collectors.toList()));
  }

  @Operation(summary = "Create a new prescription record", description = "**Roles:** `DOCTOR`")
  @PostMapping("/prescription/create")
  public ResponseEntity<Prescription> createPrescription(
      @Valid @RequestBody PrescriptionFormDTO.PrescriptionFormRequest prescriptionFormDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.ok().body(prescriptionService.createPrescription(
        prescriptionFormDTO, userDetails.getId()));
  }

  @Tag(name = "Admin")
  @Operation(summary = "Get prescriptions by id", description = "**Roles:** `SYSTEMADMIN`")
  @GetMapping("/prescription/{id}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<Prescription> getPrescription(@PathVariable("id") Long id) {
    Prescription prescription = prescriptionService.getPrescriptionById(id);
    return ResponseEntity.status(HttpStatus.OK).header("Content-type", "application/json")
        .body(prescription);
  }

  @Operation(summary = "update a prescription record", description = "**Roles:** `DOCTOR`")
  @PutMapping("/prescription/update/{id}")
  @PreAuthorize("hasAuthority('DOCTOR')")
  public ResponseEntity<?> updatePrescription(@PathVariable("id") Long id,
      @Valid @RequestBody PrescriptionFormDTO.UpdatePrescriptionFormRequest prescriptionFormDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.status(HttpStatus.OK).header("Content-Type", "application/json")
        .body(prescriptionService.updatePrescription(id, prescriptionFormDTO,
            userDetails.getId()).getDTO());
  }

  @Operation(summary = "Set Prescription status to fulfilled", description = "**Roles:** `PATIENT`")
  @PutMapping("/prescription/fulfill/{id}")
  @PreAuthorize("hasAuthority('PATIENT')")
  public ResponseEntity<String> fulfilPrescription(@PathVariable("id") Long id,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    prescriptionService.fulfilPrescription(id, userDetails.getId());
    return ResponseEntity.status(HttpStatus.OK)
        .body("{\"message\": \"\"Prescription status updated\"\"}");
  }

  @Operation(summary = "Get all drug prescriptions for specific patient", description = "**Roles:** `SYSTEMADMIN` `PATIENT` `DOCTOR`")
  @GetMapping("/prescriptions/patient/{patientId}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN') or hasAuthority('PATIENT') or hasAuthority('DOCTOR')")
  public ResponseEntity<List<PrescriptionDTO>> getAllPrescriptionsByPatientId(
      @PathVariable Long patientId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long targetId = AppUtils.enforceTargetIdIfAdminOrDoctor(patientId, userDetails);

    return ResponseEntity.ok()
        .body(prescriptionService.getAllPrescriptionsByPatientId(targetId));
  }
}
