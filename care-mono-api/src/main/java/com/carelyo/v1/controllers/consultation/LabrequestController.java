package com.carelyo.v1.controllers.consultation;

import com.carelyo.v1.dto.summary.LabrequestDTO;
import com.carelyo.v1.dto.summary.LabrequestDTO.OngoingLabDTO;
import com.carelyo.v1.enums.EConsultationStatus;
import com.carelyo.v1.model.consultation.Consultation;
import com.carelyo.v1.model.summary.Labrequest;
import com.carelyo.v1.service.consultation.ConsultationService;
import com.carelyo.v1.service.consultation.LabrequestService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.utils.AppUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;


@RestController
@Tag(name = "Labrequests", description = "`DOCTOR` `PATIENT`")
@RequestMapping("/api/v1/consultations")
public class LabrequestController {

  private final LabrequestService labrequestService;
  private final ConsultationService consultationService;

  public LabrequestController(LabrequestService labrequestService,
      ConsultationService consultationService) {
    this.labrequestService = labrequestService;
    this.consultationService = consultationService;
  }

  @Tag(name = "Admin")
  @Operation(description = "**Roles:**`SYSTEMADMIN`", summary = "Get all labrequests")
  @GetMapping("/labrequests")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<LabrequestDTO>> getAllLabrequests() {
    return ResponseEntity.ok().body(labrequestService.getAllLabrequest().stream()
        .map(Labrequest::getLabDTO)
        .collect(Collectors.toList()));
  }

  @Operation(description = "**Roles:**`DOCTOR`", summary = "Create a new labrequest record")
  @PostMapping("/labrequest/create")
  @PreAuthorize("hasAuthority('DOCTOR')")
  public ResponseEntity<OngoingLabDTO> postLabrequestForm(
      @RequestBody LabrequestDTO.createLabrequest labrequestFormDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Consultation consultation = consultationService.getConsultation(
        labrequestFormDTO.getConsultationId());
    if (!consultation.getStatus().equals(EConsultationStatus.started)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "Cannot create a labrequest for a consultation that is not started");
    }
    if (!Objects.equals(consultation.getDoctorId(), userDetails.getId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You are not authorized to create a labrequest for this consultation");

    }
    return ResponseEntity.ok()
        .header("Content-Type", "application/json")
        .body(labrequestService.createLabrequest(labrequestFormDTO, consultation)
            .getOngoingLabDTO());
  }

  @Operation(description = "**Roles:**`DOCTOR`", summary = "Update a labrequest record")
  @PutMapping("/labrequest/update")
  @PreAuthorize("hasAuthority('DOCTOR')")
  public ResponseEntity<OngoingLabDTO> updateLabrequest(
      @Valid @RequestBody LabrequestDTO.updateLabrequest labrequestDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Labrequest labrequest = labrequestService.getLabrequest(labrequestDTO.getId());
    if (Objects.equals(labrequest.getDoctorId(), userDetails.getId())) {
      return ResponseEntity.ok()
          .header("Content-Type", "application/json")
          .body(labrequestService.updateLabrequest(labrequestDTO).getOngoingLabDTO());
    }
    throw new ResponseStatusException(HttpStatus.FORBIDDEN,
        "You are not authorized to update this labrequest");

  }

  @Operation(description = "**Roles:**`PATIENT` `DOCTOR`", summary = "Get all labrequests for specific patient")
  @GetMapping("/labrequest/patient/{patientId}")
  @PreAuthorize("hasAuthority('DOCTOR') or hasAuthority('PATIENT')")
  public ResponseEntity<List<LabrequestDTO>> getLabrequestsOfSpecificPatient(
      @PathVariable Long patientId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long targetId = AppUtils.enforceTargetIdIfAdminOrDoctor(patientId, userDetails);

    return ResponseEntity.ok()
        .body(labrequestService.getLabsByPatientId(targetId)
            .stream()
            .map(Labrequest::getLabDTO)
            .collect(Collectors.toList()));

  }

  @Operation(description = "**Roles:**`DOCTOR`", summary = "Delete a labrequest record")
  @DeleteMapping("/labrequest/delete/{id}")
  @PreAuthorize("hasAuthority('DOCTOR')")
  public ResponseEntity<String> deleteLabrequest(@PathVariable Long id,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Labrequest labrequest = labrequestService.getLabrequest(id);
    if (Objects.equals(labrequest.getDoctorId(), userDetails.getId())) {
      labrequestService.deleteLabrequest(id);
      return ResponseEntity.ok()
          .header("Content-Type", "application/json")
          .body("{\"message\":\"Labrequest deleted\"}");
    }
    return ResponseEntity.status(HttpStatus.FORBIDDEN)
        .header("Content-Type", "application/json")
        .body("{\"message\":\"" + "You are not authorized to delete this labrequest"
            + "\"}");
  }
}