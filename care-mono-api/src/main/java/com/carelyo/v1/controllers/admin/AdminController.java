package com.carelyo.v1.controllers.admin;

import com.carelyo.v1.dto.admin.ConsultationGetDTO;
import com.carelyo.v1.dto.admin.DoctorUserDTO;
import com.carelyo.v1.dto.admin.DoctorUserResponseDTO;
import com.carelyo.v1.dto.admin.PatientUserDTO;
import com.carelyo.v1.dto.admin.PatientUserResponseDTO;
import com.carelyo.v1.dto.auth.SignupDTO;
import com.carelyo.v1.dto.user.UserDTO;
import com.carelyo.v1.model.role.ERole;
import com.carelyo.v1.model.user.SystemAdmin;
import com.carelyo.v1.model.user.User;
import com.carelyo.v1.model.user.doctor.Doctor;
import com.carelyo.v1.service.admin.AdminService;
import com.carelyo.v1.service.auth.RegistrationService;
import com.carelyo.v1.service.doctor.DoctorService;
import com.carelyo.v1.service.patient.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import javax.mail.MessagingException;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import kong.unirest.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin", description = "**Role:** `SYSTEMADMIN`")
public class AdminController {

  private final AdminService adminService;
  private final RegistrationService registrationService;
  private final DoctorService doctorService;
  private final PatientService patientService;

  public AdminController(AdminService adminService, RegistrationService registrationService,
      DoctorService doctorService, PatientService patientService) {
    this.adminService = adminService;
    this.registrationService = registrationService;
    this.doctorService = doctorService;
    this.patientService = patientService;
  }

  @Operation(summary = "Silently Updates the users role", description = "**DOES NOT CREATE A PROFILE FOR THE USER**, only updates the role")
  @PutMapping("/users/role/add/{role}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<String> updateUserRole(@NotNull @RequestParam("userId") Long id,
      @PathVariable("role") ERole role) {
    User user = adminService.updateUsersRole(id, role);
    return ResponseEntity.ok()
        .body("{\"message\": \" " + role + " added to " + user.getEmail() + "\"}");
  }

  @Operation(summary = "Create a user with a specific role", description = "**Role:** `SYSTEMADMIN`")
  @PostMapping("/users/create")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<String> registerUser(
      @Valid @RequestBody SignupDTO.UserSignupDTO userSignupDTO) {
    registrationService.registerUser(userSignupDTO);
    return ResponseEntity.ok().header("Content-Type", "application/json")
        .body("{\"message\": \"User created successfully\"}");
  }

  @Operation(summary = "Update a patient user", description = "**Role:** `SYSTEMADMIN`")
  @PutMapping("/users/patient/update/{userId}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<String> updatePatientUser(
      @PathVariable("userId") Long userId,
      @Valid @RequestBody PatientUserDTO patientUserDTO) {
    adminService.updatePatientUser(userId, patientUserDTO);
    return ResponseEntity.ok().body("The patient user has been updated!");
  }

  @Operation(summary = "Update a doctor user", description = "**Role:** `SYSTEMADMIN`")
  @PutMapping("/users/doctor/update/{userId}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<String> updateDoctorUser(
      @PathVariable("userId") Long userId,
      @Valid @RequestBody DoctorUserDTO doctorUserDTO) {
    adminService.updateDoctorUser(userId, doctorUserDTO);
    return ResponseEntity.ok().body("The doctor user has been updated!");
  }

  @Operation(summary = "Gets user by id", description = "**Role:** `SYSTEMADMIN`")
  @GetMapping("/users/{userId}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<?> getUser(@PathVariable("userId") Long userId) {
    User user = adminService.getUserById(userId);
    if (doctorService.isDoctor(user.getId())) {
      Doctor doctor = doctorService.getByUserId(user.getId());
      return ResponseEntity.ok().body(new DoctorUserDTO(
          user.getEmail(),
          user.getMobile(),
          doctor.getFirstName(),
          doctor.getLastName(),
          doctor.getMedicalCertificate(),
          doctor.getHospital(),
          doctor.getNationalIdNumber(),
          user.getPassword()));
    } else if (patientService.isPatientByUserId(user.getId())) {
      return ResponseEntity.ok().body(new PatientUserDTO(
          user.getEmail(),
          user.getMobile()));
    }
    SystemAdmin systemAdmin = adminService.getSystemAdmin(user.getId());
    JSONObject jsonObject = new JSONObject();
    jsonObject.put("id", systemAdmin.getId());
    jsonObject.put("email", user.getEmail());
    jsonObject.put("mobile", user.getMobile());
    jsonObject.put("fullName", systemAdmin.getFirstName() + " " + systemAdmin.getLastName());
    return ResponseEntity.ok().body(jsonObject.toString());
  }

  @Operation(summary = "Update a users password", description = "**Role:** `SYSTEMADMIN`")
  @PutMapping("/users/password/update/{userid}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<String> updateUserPassword(@PathVariable("userid") Long id)
      throws MessagingException, IOException {
    adminService.updateUserPassword(id);
    return ResponseEntity.ok().body("Password has been updated");
  }

  @Operation(summary = "Get all users")
  @GetMapping("/users")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<UserDTO>> getAllUsers() {
    List<User> user = adminService.getAllUsers();

    return ResponseEntity.ok().body(user
        .stream()
        .map(User::getUserDTO)
        .collect(Collectors.toList()));
  }

  @Operation(summary = "Disable a user")
  @PutMapping("/users/disable/{userId}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<String> disableUser(@PathVariable("userId") Long id)
      throws MessagingException, IOException {
    String message = adminService.disableUser(id);
    return ResponseEntity.ok().body(message);
  }

  @Operation(summary = "Retrieves all the consultations", description = "**Role:** `SYSTEMADMIN`")
  @GetMapping("/consultations")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<ConsultationGetDTO>> getAllConsultations() {
    return ResponseEntity.ok(adminService.getAllConsultations());
  }

  @Operation(summary = "Retrieves all the doctor users", description = "**Role:** `SYSTEMADMIN`")
  @GetMapping("/doctors")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<DoctorUserResponseDTO>> getAllDoctorUsers() {
    return ResponseEntity.ok(adminService.getAllDoctorUsers());
  }

  @Operation(summary = "Retrieves all the patient users", description = "**Role:** `SYSTEMADMIN`")
  @GetMapping("/patients")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<PatientUserResponseDTO>> getAllPatientUsers() {
    return ResponseEntity.ok(adminService.getAllPatientUsers());
  }

}
