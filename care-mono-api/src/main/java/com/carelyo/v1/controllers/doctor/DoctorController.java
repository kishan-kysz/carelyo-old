package com.carelyo.v1.controllers.doctor;

import com.carelyo.v1.dto.doctor.DoctorDTO;
import com.carelyo.v1.dto.doctor.MedicalCertificateDTO.UpdateMedicalCertificate;
import com.carelyo.v1.enums.EDoctorStatus;
import com.carelyo.v1.model.user.User;
import com.carelyo.v1.model.user.doctor.Accolade;
import com.carelyo.v1.model.user.doctor.Doctor;
import com.carelyo.v1.model.user.doctor.MedicalCertificate;
import com.carelyo.v1.service.admin.StatisticsService;
import com.carelyo.v1.service.doctor.AccoladeService;
import com.carelyo.v1.service.doctor.DoctorService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.user.UserService;
import com.carelyo.v1.utils.AppUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Tag(name = "Doctor")
@RequestMapping("/api/v1/doctors")

public class DoctorController {

  static Long MAX_FILE_SIZE = 5000000L; // 5MB
  private final DoctorService doctorService;

  private final UserService userService;
  private final AccoladeService accoladeService;
  private final StatisticsService statisticsService;

  public DoctorController(DoctorService doctorService, UserService userService,
      AccoladeService accoladeService, StatisticsService statisticsService) {
    this.doctorService = doctorService;
    this.userService = userService;
    this.accoladeService = accoladeService;

    this.statisticsService = statisticsService;
  }

  @Operation(summary = "Get all doctors", description = "**Role:** `SYSTEMADMIN`")
  @GetMapping
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
    List<DoctorDTO> doctors = doctorService.getAllDoctors().stream().map(
        doctor -> {
          User user = userService.getUserById(doctor.getUserId());
          Double rating = statisticsService.getAverageRating(user.getId());
          return doctor.getDoctorDto(user.getId(), user.getMobile(), user.getEmail(),
              user.getReferralCount(), user.getReferralCode(), doctor, null, rating);
        }).collect(Collectors.toList());
    return ResponseEntity.status(HttpStatus.OK).body(doctors);
  }

  @Operation(summary = "Get doctor by userId", description = "**Role:** `DOCTOR` `SYSTEMADMIN`")
  @GetMapping("/doctor/{userId}")
  @Parameter(name = "userDetails", hidden = true)
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<DoctorDTO> getDoctor(@PathVariable("userId") Long userId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long targetId = AppUtils.enforceTargetIfAdmin(userId, userDetails);
    Doctor doctor = doctorService.getByUserId(targetId);
    String url = doctorService.getAvatar(targetId);

    User user = userService.getUserById(doctor.getUserId());
    Double rating = statisticsService.getAverageRating(targetId);

    return ResponseEntity.status(HttpStatus.OK)
        .body(doctor.getDoctorDto(user.getId(), user.getMobile(), user.getEmail(),
            user.getReferralCount(), user.getReferralCode(), doctor, url, rating));
  }

  @Operation(summary = "Approve user as doctor", description = "**Role:** `SYSTEMADMIN`")
  @PutMapping("/profile/update-status/{userId}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<String> updateDoctorAccountStatus(@PathVariable("userId") Long userId,
      @RequestParam("status") EDoctorStatus status) {
    doctorService.updateDoctorStatus(userId, status);
    return ResponseEntity.status(HttpStatus.OK).header("Content-Type", "application/json")
        .body("{\"message\":\"Doctor status updated successfully \"}");
  }

  @Operation(summary = "Update a doctors profile", description = "**Role:** `DOCTOR`  `SYSTEMADMIN`")
  @PutMapping("/profile/update")
  @Parameter(name = "userDetails", hidden = true)
  @PreAuthorize("hasAuthority('DOCTOR') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<DoctorDTO> updateProfessionalProfile(
      @Valid @RequestBody DoctorDTO.CompleteProfileDTO updateDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long targetId = AppUtils.enforceTargetIfAdmin(updateDTO.getUserId(), userDetails);
    Doctor doctor = doctorService.updateProfile(updateDTO, targetId);
    String url = doctorService.getAvatar(targetId);
    User user = userService.getUserById(doctor.getUserId());
    Double rating = statisticsService.getAverageRating(targetId);
    return ResponseEntity.status(HttpStatus.OK).body(
        doctor.getDoctorDto(user.getId(), user.getMobile(), user.getEmail(),
            user.getReferralCount(), user.getReferralCode(), doctor, url, rating));
  }

  @Operation(summary = "Update user profile picture", description = "**Role:** `DOCTOR` `SYSTEMADMIN`")
  @PutMapping(path = "/profile/avatar/upload", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
  @PreAuthorize("hasAuthority('DOCTOR') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<String> updateProfilePicture(
      @RequestParam(value = "userId", required = false) Long userId,
      @RequestParam("image") MultipartFile file,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long targetId = AppUtils.enforceTargetIfAdmin(userId, userDetails);

    if (Objects.requireNonNull(file.getContentType()).contains("jpg") || file.getContentType()
        .contains("jpeg") || file.getContentType().contains("png")) {
      if (file.getSize() > MAX_FILE_SIZE) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .header("Content-Type", "application/json")
            .body("{\"message\":\"File size too large\" }");
      }
      String url = doctorService.updateProfilePicture(targetId, file);
      return ResponseEntity.status(HttpStatus.OK)
          .header("Content-Type", "application/json")
          .body("{\"message\":\"Profile picture updated successfully\", \"url\":\""
              + url + "\"}");
    } else {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .header("Content-Type", "application/json")
          .body("{\"message\":\"Invalid file type\"}");
    }
  }

  @Operation(summary = "Update a doctors MDCN certificate.", description = "**Role:** `DOCTOR` `SYSTEMADMIN`")
  @PutMapping("/profile/update-certificate")
  @Parameter(name = "userDetails", hidden = true)
  @PreAuthorize("hasAuthority('DOCTOR')  or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<MedicalCertificate> updateMDCNCertificate(
      @RequestParam(required = false, value = "userId") Long userId,
      @RequestBody UpdateMedicalCertificate updateDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long targetId = AppUtils.enforceTargetIfAdmin(userId, userDetails);
    MedicalCertificate medicalCertificate = doctorService.updateMDCNCertificate(targetId,
        updateDTO);
    return ResponseEntity.status(HttpStatus.OK).body(medicalCertificate);

  }

  @Operation(summary = "Update a doctor's national identification number", description = "**Role:** `SYSTEMADMIN`")
  @PutMapping("/profile/update-nationalId/{userId}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<String> updateDoctorNIN(@PathVariable Long userId,
      @RequestParam("nationalIdentificationNumber") Long nationalIdentificationNumber) {
    doctorService.updateDoctorNIN(userId, nationalIdentificationNumber);
    return ResponseEntity.status(HttpStatus.OK).header("Content-Type", "application/json")
        .body("{\"message\": \"National ID updated successfully\"}");
  }

  @Operation(summary = "Add a doctors accolade", description = "**Role:** `SYSTEMADMIN`")
  @PostMapping("/profile/accolade/add")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')or hasAuthority('DOCTOR') ")
  public ResponseEntity<Accolade> addAccolade(
      @Valid @RequestBody DoctorDTO.CreateAccoladeDTO accoladeAdd,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long targetId = AppUtils.enforceTargetIfAdmin(accoladeAdd.getDoctorId(), userDetails);
    Accolade accolade = accoladeService.addAccolade(targetId, accoladeAdd);
    return ResponseEntity.status(HttpStatus.OK).body(accolade);

  }

  @Operation(summary = "Update a doctor's accolade", description = "**Role:** `SYSTEMADMIN`")
  @PutMapping("/profile/accolade/update")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')or hasAuthority('DOCTOR') ")
  public ResponseEntity<Accolade> updateAccolade(
      @RequestParam(required = false, value = "userId") Long userId,
      @Valid @RequestBody DoctorDTO.UpdateAccoladeDTO accoladeUpdate,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long targetId = AppUtils.enforceTargetIfAdmin(userId, userDetails);
    Accolade accolade = accoladeService.updateAccolade(targetId, accoladeUpdate);
    return ResponseEntity.status(HttpStatus.OK).body(accolade);

  }

  @Operation(summary = "Delete a doctor's accolade", description = "**Role:** `SYSTEMADMIN` `DOCTOR`")
  @DeleteMapping("/profile/accolade/delete")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')or hasAuthority('DOCTOR') ")
  public ResponseEntity<String> deleteAccolade(
      @RequestParam(required = false, value = "userId") Long userId,
      @RequestParam Long accoladeId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long targetId = AppUtils.enforceTargetIfAdmin(userId, userDetails);
    accoladeService.deleteAccolade(accoladeId, targetId);
    return ResponseEntity.status(HttpStatus.OK).header("Content-Type", "application/json")
        .body("{\"message\": \"Accolade deleted successfully\"}");
  }

  @Operation(summary = "Get all Accolades", description = "**Role:** `SYSTEMADMIN` `DOCTOR`")
  @GetMapping("/profile/accolades/{userId}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')or hasAuthority('DOCTOR') ")
  public ResponseEntity<List<Accolade>> getAccolades(
      @PathVariable(required = false, value = "userId") Long userId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long targetId = AppUtils.enforceTargetIfAdmin(userId, userDetails);
    List<Accolade> accolades = accoladeService.getAccoladesByUserId(targetId);
    return ResponseEntity.status(HttpStatus.OK).body(accolades);
  }

  @Operation(summary = "Suspend doctor", description = "**Role:** `SYSTEMADMIN`")
  @PutMapping("/profile/suspend/{userId}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<String> suspendDoctor(@PathVariable Long userId) {

    doctorService.suspendDoctor(userId);

    return ResponseEntity.status(HttpStatus.OK)
        .body("Doctor is suspended");

  }

  @Operation(summary = "Reactivate doctor profile", description = "**Role:** `SYSTEMADMIN`")
  @PutMapping("/profile/reactivate/{userId}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<String> reactivateDoctorProfile(@PathVariable Long userId) {

    doctorService.reactivateDoctorProfile(userId);

    return ResponseEntity.status(HttpStatus.OK)
        .body("Doctor is active again");

  }

}
