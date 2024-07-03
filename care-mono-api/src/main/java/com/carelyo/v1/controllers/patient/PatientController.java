package com.carelyo.v1.controllers.patient;

import com.carelyo.v1.dto.patient.PatientDTO;
import com.carelyo.v1.dto.patient.PatientDTO.CompletePatientProfileDTO;
import com.carelyo.v1.dto.patient.PatientDTO.UpdateProfileDTO;
import com.carelyo.v1.dto.patient.PatientProfileDTO;
import com.carelyo.v1.dto.provider.ProviderInformationDTO;
import com.carelyo.v1.dto.vitals.VitalsDTO;
import com.carelyo.v1.dto.vitals.VitalsDTO.CreateVitals;
import com.carelyo.v1.model.user.patient.Patient;
import com.carelyo.v1.service.invitation.InvitationService;
import com.carelyo.v1.service.patient.PatientService;
import com.carelyo.v1.service.provider.ProviderService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.user.UserService;
import com.carelyo.v1.service.vitals.VitalsService;
import com.carelyo.v1.utils.AppUtils;
import com.carelyo.v1.utils.enums.EInvitation;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import javax.annotation.Nullable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@Tag(name = "Patient")
@RequestMapping("/api/v1/patients")
public class PatientController {
  private final PatientService patientService;
  private final InvitationService invitationService;
  private final UserService userService;
  private final ProviderService providerService;
  private final VitalsService vitalsService;

  public PatientController(PatientService patientService, InvitationService invitationService,
      UserService userService, ProviderService providerService, VitalsService vitalsService) {
    this.patientService = patientService;
    this.invitationService = invitationService;
    this.userService = userService;
    this.providerService = providerService;
    this.vitalsService = vitalsService;
  }

  @Operation(summary = "Get user profiles of all patients", description = "**Role:** `SYSTEMADMIN` or DOCTOR")
  @GetMapping
  @PreAuthorize("hasAuthority('SYSTEMADMIN') or hasAuthority('DOCTOR')")
  public ResponseEntity<List<PatientDTO>> getAllPatients() {
    return ResponseEntity.ok(patientService.getAllPatients());
  }

  @Operation(summary = "Get a patient", description = "**Role:** `SYSTEMADMIN` or DOCTOR")
  @GetMapping("/{id}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN') or hasAuthority('DOCTOR')")
  public ResponseEntity<Patient> getPatientWithId(@PathVariable Long id) {
    return ResponseEntity.ok(patientService.getPatientByUserId(id));
  }

  @Operation(summary = "Edit a patient", description = "**Role:** `PATIENT` `SYSTEMADMIN`" +
      "\n\n You can update each part of a patient medical profile, You do not need to send all the fields."
      + "\n\n i.e updating the patient allergies just send an object with the property allergies with the updated list of allergies")
  @PutMapping(value = "/profile/edit/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<PatientProfileDTO> editProfile(
      @PathVariable("userId") Long userId,
      @RequestParam(name = "ninCard", required = false) MultipartFile ninCard,
      @ModelAttribute @Nullable UpdateProfileDTO patientProfileDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    if (patientProfileDTO == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Body cannot be empty");
    }

    Long targetId = AppUtils.enforceTargetIfAdmin(userId, userDetails);
    return ResponseEntity.ok(
        patientService.editPatientProfile(targetId, patientProfileDTO, ninCard));

  }

  @Operation(summary = "Edit a patient Locale", description = "**Role:** `PATIENT` `SYSTEMADMIN`" +
      "\n\n You can update each part of a patient medical profile, You do not need to send all the fields."
      + "\n\n i.e updating the patient allergies just send an object with the property allergies with the updated list of allergies")
  @PutMapping("/profile/edit/locale/{userId}")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<PatientProfileDTO> editLocale(
      @PathVariable("userId") Long userId,
      @RequestBody @Nullable UpdateProfileDTO patientProfileDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    if (patientProfileDTO == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Body cannot be empty");
    }

    Long targetId = AppUtils.enforceTargetIfAdmin(userId, userDetails);
    return ResponseEntity.ok(
        patientService.editPatientLocale(targetId, patientProfileDTO));

  }

  @Operation(summary = "Edit a patient's child", description = "**Role:** `PATIENT` `SYSTEMADMIN`")
  @PutMapping("/child/profile/edit/{userId}")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<PatientProfileDTO> editChildProfile(
      @PathVariable("userId") Long userId,
      @RequestBody(required = false) @Nullable UpdateProfileDTO patientProfileDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    if (patientProfileDTO == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Body cannot be empty");
    }

    return ResponseEntity.ok(patientService.editChildProfile(userId, userDetails, patientProfileDTO));
  }

  @Operation(summary = "Complete a patient's profile", description = "**Role:** `PATIENT` `SUPPORT` `SYSTEMADMIN`")
  @PutMapping("/profile/complete/{userId}")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('SUPPORT') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<PatientProfileDTO> completePatientProfile(
      @PathVariable("userId") Long userId,
      @RequestBody CompletePatientProfileDTO patientProfileDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long targetId = AppUtils.enforceTargetIfAdmin(userId, userDetails);
    PatientProfileDTO patient = patientService.completePatientProfile(targetId, patientProfileDTO);
    userService.findById(targetId)
        .ifPresent(targetUser -> invitationService.updateInvitationStatus(
            targetUser.getEmail(),
            EInvitation.complete));
    return ResponseEntity.ok(patient);
  }

  @Operation(summary = "Complete a child's profile", description = "**Role:** `PATIENT` `SYSTEMADMIN`")
  @PutMapping("/child/profile/complete/{userId}")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<PatientProfileDTO> completeChildProfile(
      @PathVariable("userId") Long userId,
      @RequestBody CompletePatientProfileDTO patientProfileDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.ok(
        patientService.completeChildProfile(userId, userDetails, patientProfileDTO));
  }

  @Operation(summary = "Get a patient's children", description = "**Role:** `PATIENT` `SYSTEMADMIN`")
  @GetMapping("/children/{userId}")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<PatientDTO>> getChildren(
      @PathVariable("userId") Long userId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.ok(patientService.getChildren(userId, userDetails));
  }

  @Operation(summary = "Check if national id exists", description = "**Role** `PATIENT`")
  @GetMapping("/is-national-id/{nationalId}")
  @PreAuthorize("hasAuthority('PATIENT')")
  public ResponseEntity<Boolean> isNationalId(@PathVariable String nationalId) {
    return ResponseEntity.ok().body(patientService.isNationalId(nationalId));
  }

  @Operation(summary = "provider information", description = "**Role** `PATIENT`")
  @GetMapping("/provider/information/{id}")
  @PreAuthorize("hasAuthority('PATIENT')")
  public ResponseEntity<ProviderInformationDTO> getProviderInformation(@PathVariable Long id) {

    return ResponseEntity.ok()
        .body(providerService.getProviderInformation(id).getProviderInformationDTO());
  }

  @Operation(summary = "Get patient vitals", description = "**Role** `PATIENT` `DOCTOR` `SYSTEMADMIN`")
  @GetMapping("/vitals/{id}")
  @PreAuthorize("hasAnyAuthority('PATIENT', 'DOCTOR', 'SYSTEMADMIN')")
  public ResponseEntity<VitalsDTO> getPatientVitals(@PathVariable("id") Long id,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.ok().body(vitalsService.getVitalsByUserIdAndChildId(id, null, userDetails));
  }

  @Operation(summary = "Create patient vitals", description = "**Role** `PATIENT` `DOCTOR` `SYSTEMADMIN`")
  @PostMapping("/vitals/create/{id}")
  @PreAuthorize("hasAnyAuthority('PATIENT', 'DOCTOR', 'SYSTEMADMIN')")
  public ResponseEntity<String> createPatientVitals(@PathVariable Long id,
      @RequestBody CreateVitals vitalsDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    vitalsService.createVitals(vitalsDTO, userDetails, id, null);
    return ResponseEntity.ok().body("Vitals created successfully");
  }
}
