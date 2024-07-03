package com.carelyo.v1.controllers.user;

import com.carelyo.v1.dto.consultation.ConsultationDTO.ActiveConsultationDoctor;
import com.carelyo.v1.dto.consultation.ConsultationDTO.UnratedConsultation;
import com.carelyo.v1.dto.doctor.DoctorDTO;
import com.carelyo.v1.dto.patient.PatientProfileDTO;
import com.carelyo.v1.dto.user.UpdateEmailDTO;
import com.carelyo.v1.dto.user.UpdatePasswordDTO;
import com.carelyo.v1.dto.user.UpdatePhoneNumberDTO;
import com.carelyo.v1.model.consultation.Consultation;
import com.carelyo.v1.model.user.User;
import com.carelyo.v1.model.user.doctor.Doctor;
import com.carelyo.v1.model.user.patient.Patient;
import com.carelyo.v1.service.admin.StatisticsService;
import com.carelyo.v1.service.consultation.ConsultationService;
import com.carelyo.v1.service.doctor.DoctorService;
import com.carelyo.v1.service.patient.PatientService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.user.UserService;
import com.carelyo.v1.utils.AppUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@Tag(name = "User")
@RequestMapping("/api/v1/users")
public class UserController {

  private final UserService userService;
  private final DoctorService doctorService;
  private final PatientService patientService;
  private final StatisticsService statisticsService;
  private final ConsultationService consultationService;

  public UserController(UserService userService, DoctorService doctorService,
      PatientService patientService, StatisticsService statisticsService, ConsultationService consultationService) {
    this.userService = userService;
    this.doctorService = doctorService;
    this.patientService = patientService;
    this.statisticsService = statisticsService;
    this.consultationService = consultationService;
  }

  @Operation(summary = "Change/update password for user", description = "**Role:**`DOCTOR` `LABADMIN` `LABSCIENTIST` `PATIENT` `PHARMACYADMIN` `PHARMACYUSER` `SUPPORT` `SYSTEMADMIN`")
  @PutMapping("/update-password/{userId}")
  @PreAuthorize("hasAnyAuthority('DOCTOR', 'PATIENT','SYSTEMADMIN')")
  public ResponseEntity<String> updatePassword(
      @Valid @RequestBody UpdatePasswordDTO updatePasswordDTO,
      @PathVariable("userId") Long userId) {
    userService.updatePassword(updatePasswordDTO, userId);
    return ResponseEntity.ok().body("Password has been updated");
  }

  @Operation(summary = "Change/update email for user", description = "**Role:**`DOCTOR` `LABADMIN` `LABSCIENTIST` `PATIENT` `PHARMACYADMIN` `PHARMACYUSER` `SUPPORT` `SYSTEMADMIN`")
  @PutMapping("/update-email/{userId}")
  @PreAuthorize("hasAnyAuthority('DOCTOR', 'PATIENT','SYSTEMADMIN')")
  public ResponseEntity<String> updateEmail(@Valid @RequestBody UpdateEmailDTO updateEmailDTO,
      @PathVariable("userId") Long userId) {
    userService.updateEmail(updateEmailDTO, userId);
    return ResponseEntity.ok().body("Email has been updated");
  }

  @Operation(summary = "Change/update phone number for user", description = "**Role:**`DOCTOR``PATIENT` `SYSTEMADMIN`")
  @PutMapping("/update-mobile/{userId}")
  @PreAuthorize("hasAnyAuthority('DOCTOR', 'PATIENT','SYSTEMADMIN')")
  public ResponseEntity<String> updatePhoneNumber(
      @Valid @RequestBody UpdatePhoneNumberDTO updatePhoneNumberDTO,
      @PathVariable("userId") Long userId) {
    userService.updatePhoneNumber(updatePhoneNumberDTO, userId);
    return ResponseEntity.ok().body("Phone number has been updated");
  }

  @Operation(summary = "Get user details", description = "**Role:**`DOCTOR` `PATIENT` `SYSTEMADMIN`")
  @GetMapping("/profile/{userId}")
  @PreAuthorize("hasAnyAuthority('DOCTOR', 'PATIENT','SYSTEMADMIN')")
  public ResponseEntity<?> getUserProfile(@PathVariable("userId") Long userId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    String role = userDetails.getAuthorities().stream().findFirst().get().getAuthority();
    Long targetId = AppUtils.enforceTargetIfAdmin(userId, userDetails);
    switch (role) {
      case "PATIENT":
        Patient patient = patientService.getPatientByUserId(targetId);
        User user = userService.getUserById(targetId);
        Consultation consultation = consultationService.getActiveConsultationPatient(targetId);
        List<UnratedConsultation> unratedConsultations = consultationService.getUnratedConsultations(targetId);
        return ResponseEntity.status(HttpStatus.OK)
            .body(patientService.getPatientProfile(patient, user, consultation, unratedConsultations));

      case "DOCTOR":
        Doctor doctor = doctorService.getByUserId(targetId);
        String profilePicture = doctorService.getAvatar(targetId);
        Double rating = statisticsService.getAverageRating(targetId);
        ActiveConsultationDoctor activeConsultation = new ActiveConsultationDoctor(
            consultationService.getActiveConsultationDoctor(targetId));
        DoctorDTO.Response response = doctor.getDoctorDto(userDetails.getId(),
            userDetails.getMobile(), userDetails.getEmail(),
            userDetails.getReferralCount(), userDetails.getReferralCode(), doctor,
            profilePicture, rating, activeConsultation, doctor.getProviderId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
      case "SYSTEMADMIN":
        return ResponseEntity.status(HttpStatus.OK)
            .body(userService.getUserById(targetId).getUserDTO());
      default:
        throw new ResponseStatusException(HttpStatus.FORBIDDEN,
            "You are not authorized to access this resource");

    }
  }

  @GetMapping("/getUserByEmail/{email}")
  public PatientProfileDTO getUserByEmail(@PathVariable("email") String email,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return patientService.getUserByEmail(email,userDetails);
    }
  }
