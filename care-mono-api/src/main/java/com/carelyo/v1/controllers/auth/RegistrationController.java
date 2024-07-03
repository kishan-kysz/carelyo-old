package com.carelyo.v1.controllers.auth;

import com.carelyo.v1.dto.auth.SignupDTO;
import com.carelyo.v1.service.auth.RegistrationService;
import com.carelyo.v1.service.invitation.InvitationService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.utils.enums.EInvitation;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@Tag(name = "Auth", description = "Login and register")
@RequestMapping("/api/v1/auth/")
public class RegistrationController {

  private final RegistrationService registrationService;
  private final InvitationService invitationService;

  public RegistrationController(RegistrationService registrationService,
      InvitationService invitationService) {
    this.registrationService = registrationService;
    this.invitationService = invitationService;

  }

  @Operation(summary = "Register an administrator")
  @Tag(name = "Admin")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Registration was successful"),
      @ApiResponse(responseCode = "400", description = "Can occur when wrong format and/or d-types of JSON object is sent.") })
  @PostMapping("register/admin")
  public ResponseEntity<String> registerAdmin(
      @Valid @RequestBody SignupDTO.AdminSignupDTO adminSignUpDTO) {
    registrationService.registerAdmin(adminSignUpDTO);
    return ResponseEntity.status(HttpStatus.OK).header("Content-Type", "application/json")
        .body("{\"message\":\"Account created successfully\"}");
  }

  @Operation(summary = "Register a patient")
  @Tag(name = "Patient")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Registration was successful"),
      @ApiResponse(responseCode = "400", description = "Can occur when wrong format and/or d-types of JSON object is sent.") })
  @PostMapping("register/patient")
  public ResponseEntity<String> registerPatient(
      @Valid @RequestBody SignupDTO.PatientSignupDTO patientSignUpDTO) {
    invitationService.updateInvitationStatus(patientSignUpDTO.getEmail(),
        EInvitation.registered);
    registrationService.registerPatient(patientSignUpDTO);
    return ResponseEntity.status(HttpStatus.OK).header("Content-Type", "application/json")
        .body("{\"message\":\"Account created successfully\"}");
  }

  @Operation(summary = "Register a child. Must be logged in as patient")
  @Tag(name = "Patient")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Registration was successful"),
      @ApiResponse(responseCode = "400", description = "Can occur when wrong format and/or d-types of JSON object is sent.") })
  @PostMapping("register/child")
  @PreAuthorize("hasAuthority('PATIENT')")
  public ResponseEntity<String> registerChild(
      @Valid @RequestBody SignupDTO.PatientSignupDTO childSignupDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    invitationService.updateInvitationStatus(childSignupDTO.getEmail(),
        EInvitation.registered);
    registrationService.registerChild(childSignupDTO, userDetails);
    return ResponseEntity.status(HttpStatus.OK).header("Content-Type", "application/json")
        .body("{\"message\":\"Account created successfully\"}");
  }

  @Operation(summary = "Register a doctor(Must be logged in as admin)")
  @Tag(name = "Doctor")
  @PostMapping("register/doctor")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<String> registerMedicalProfessional(
      @Valid @RequestBody SignupDTO.DoctorSignupDTO doctorSignUpDTO) {

    registrationService.registerDoctor(doctorSignUpDTO);
    return ResponseEntity.status(HttpStatus.OK)
        .header("Content-Type", "application/json")
        .body("{\"message\":\"Account created successfully\"}");

  }
}
