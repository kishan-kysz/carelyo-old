package com.carelyo.v1.service.admin;

import com.carelyo.v1.dto.admin.ConsultationGetDTO;
import com.carelyo.v1.dto.admin.DoctorUserDTO;
import com.carelyo.v1.dto.admin.DoctorUserResponseDTO;
import com.carelyo.v1.dto.admin.PatientUserDTO;
import com.carelyo.v1.dto.admin.PatientUserResponseDTO;
import com.carelyo.v1.model.role.ERole;
import com.carelyo.v1.model.role.Role;
import com.carelyo.v1.model.user.SystemAdmin;
import com.carelyo.v1.model.user.User;
import com.carelyo.v1.model.user.doctor.Doctor;
import com.carelyo.v1.model.user.patient.Patient;
import com.carelyo.v1.service.consultation.ConsultationService;
import com.carelyo.v1.service.doctor.DoctorService;
import com.carelyo.v1.service.email.thymeleaf_email.component.EmailSenderService;
import com.carelyo.v1.service.email.thymeleaf_email.model.Mail;
import com.carelyo.v1.service.patient.PatientService;
import com.carelyo.v1.service.user.RolesService;
import com.carelyo.v1.service.user.SystemAdminService;
import com.carelyo.v1.service.user.UserService;
import com.carelyo.v1.utils.AppUtils;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminService {

  private final PasswordEncoder passwordEncoder;
  private final RolesService rolesService;
  private final EmailSenderService emailSenderService;
  private final PatientService patientService;
  private final SystemAdminService systemAdminService;
  private final UserService userService;
  private final DoctorService doctorService;
  private final ConsultationService consultationService;

  public AdminService(
      RolesService rolesService,
      PasswordEncoder passwordEncoder,
      EmailSenderService emailSenderService,
      PatientService patientService,
      SystemAdminService systemAdminService, UserService userService,
      DoctorService doctorService,
      ConsultationService consultationService) {

    this.rolesService = rolesService;
    this.passwordEncoder = passwordEncoder;
    this.emailSenderService = emailSenderService;
    this.patientService = patientService;
    this.systemAdminService = systemAdminService;
    this.userService = userService;
    this.doctorService = doctorService;
    this.consultationService = consultationService;
  }

  /**
   * Adds ROLE to a user
   *
   * @param id   id
   * @param role role
   */
  public User updateUsersRole(Long id, ERole role) {
    User user = getUserById(id);
    Role roleToAdd = getRoleByName(role);
    user.setRole(roleToAdd);
    userService.save(user);

    return user;
  }


  /**
   * Updates a user's password and saves it in DB, then sends an email with the password to the user
   *
   * @param id id
   */
  public void updateUserPassword(Long id) throws MessagingException, IOException {
    User user = getUserById(id);

    String pwd = AppUtils.generateCommonLangPassword();
    String userEmail = user.getEmail();

    Mail mail = new Mail();
    Map<String, String> model = new HashMap<>();
    mail.setTo(userEmail);
    mail.setSubject("Your password has been reset.");
    model.put("pwd", pwd);
    mail.setProps(model);

    user.setPassword(passwordEncoder.encode(pwd));
    userService.save(user);

    emailSenderService.sendEmail(mail, "no template yet");
  }

  public Boolean disableUserEmail(Long id) throws MessagingException, IOException {
    Optional<User> optionalUser = userService.findById(id);

    if (optionalUser.isPresent()) {
      String userEmail = optionalUser.get().getEmail();
      Mail mail = new Mail();
      mail.setSubject("Your account has been disabled.");
      mail.setTo(userEmail);
      Map<String, String> model = new HashMap<>();
      model.put("pwd", "Your account has been disabled.");
      mail.setProps(model);

      emailSenderService.sendEmail(mail, "no template yet");

      return true;
    }
    return false;
  }

  public List<User> getAllUsers() {
    return new ArrayList<>(userService.getAll());
  }

  public String disableUser(Long id) throws MessagingException, IOException {
    updateUsersRole(id, ERole.DISABLED);
    boolean test = disableUserEmail(id);
    String message = "User is disabled.";

    if (!test) {
      message += " but mail was not sent.";
    } else {
      message += " Mail was sent to user.";
    }

    return message;
  }


  /**
   * Updates a patient user according to the supplied DTO.
   *
   * @param userId         The user id of the patient
   * @param patientUserDTO The DTO containing the information to be updated
   */
  public void updatePatientUser(Long userId, PatientUserDTO patientUserDTO) {

    User user = getUserById(userId);

    if (!patientService.isPatientByUserId(userId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "The user is not a patient.");
    }

    if (!user.getEmail().equals(patientUserDTO.getEmail())) {
      if (userService.existsByEmail(patientUserDTO.getEmail())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered.");
      }
      user.setEmail(patientUserDTO.getEmail());
    }

    if (!user.getMobile().equals(patientUserDTO.getMobile())) {
      if (userService.existsByMobile(patientUserDTO.getMobile())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT,
            "Mobile already registered.");
      }
      user.setMobile(patientUserDTO.getMobile());
    }

    userService.save(user);
  }

  /**
   * Updates a doctor user according to the supplied DTO.
   *
   * @param userId        userId The user id of the doctor
   * @param doctorUserDTO doctorUserDTO The DTO containing the information to be updated
   */
  public void updateDoctorUser(Long userId, DoctorUserDTO doctorUserDTO) {
    User user = userService.getUserById(userId);

    if (!doctorService.isDoctor(userId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "The user is not a doctor.");
    }

    Doctor doctor = doctorService.getByUserId(userId);

    if (!user.getEmail().equals(doctorUserDTO.getEmail())) {
      if (userService.existsByEmail(doctorUserDTO.getEmail())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered.");
      }
      user.setEmail(doctorUserDTO.getEmail());
    }

    if (!user.getMobile().equals(doctorUserDTO.getMobile())) {
      if (userService.existsByMobile(doctorUserDTO.getMobile())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT,
            "Mobile already registered.");
      }
      user.setMobile(doctorUserDTO.getMobile());
    }

    doctor.setFirstName(doctorUserDTO.getFirstName());
    doctor.setLastName(doctorUserDTO.getLastName());

    if (!doctor.getMedicalCertificate().getCertificateNumber()
        .equals(doctorUserDTO.getMedicalCertificate().getCertificateNumber())) {
      if (doctorService.certificateExist(
          doctorUserDTO.getMedicalCertificate().getCertificateNumber())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT,
            "Certificate number already registered.");
      }

      doctor.getMedicalCertificate().setCertificateNumber(
          doctorUserDTO.getMedicalCertificate().getCertificateNumber());

    }

    doctor.getMedicalCertificate().setIssuedDate(
        doctorUserDTO.getMedicalCertificate().getIssuedDate());
    doctor.getMedicalCertificate().setExpirationDate(
        doctorUserDTO.getMedicalCertificate().getExpirationDate());

    doctor.setHospital(doctorUserDTO.getHospital());

    if (!doctor.getNationalIdNumber().equals(doctorUserDTO.getNationalIdNumber())) {
      if (doctorService.getDoctorByNationalIdentificationNumber(doctorUserDTO.getNationalIdNumber())
          .isPresent()) {
        throw new ResponseStatusException(HttpStatus.CONFLICT,
            "National id number already registered.");
      }

      doctor.setNationalIdNumber(doctorUserDTO.getNationalIdNumber());
    }

    userService.save(user);
    doctorService.saveDoctor(doctor);
  }

  /**
   * Gets a user by id
   *
   * @param userId id
   * @return User
   */
  public User getUserById(Long userId) {
    Optional<User> optionalUser = userService.findById(userId);
    if (optionalUser.isPresent()) {
      return optionalUser.get();
    }

    throw new ResponseStatusException(HttpStatus.NOT_FOUND,
        "User with the provided id could not be found");
  }

  /**
   * Gets a role by name
   *
   * @param name role
   * @return Role
   */
  public Role getRoleByName(ERole name) {
    Optional<Role> optionalRole = rolesService.getByName(name);
    if (optionalRole.isPresent()) {
      return optionalRole.get();
    }

    throw new ResponseStatusException(HttpStatus.NOT_FOUND,
        "Role with the provided name could not be found");
  }


  /**
   * Retrieves all the consultations.
   *
   * @return The consultations
   */
  public List<ConsultationGetDTO> getAllConsultations() {
    return consultationService.getAllConsultations().stream()
        .map((consultation) -> {
          Long followUpId = consultation.getFollowUp() != null ? consultation.getFollowUp().getId()
              : null;
          return new ConsultationGetDTO(
            consultation.getId(),
            consultation.getCreatedAt(),
            consultation.getUpdatedAt(),
            consultation.getAcceptedConsultations(),
            consultation.getPatientFullName(),
            consultation.getPatientId(),
            consultation.getDoctorFullName(),
            consultation.getDoctorId(),
            consultation.getRoomName(),
            consultation.getTransactionReference(),
            consultation.getTransactionUrl(),
            consultation.getPriceListName(),
            consultation.getAmountPaid(),
            consultation.getLanguage(),
            consultation.getStatus(),
            consultation.getTimeBooked(),
            consultation.getTimeAccepted(),
            consultation.getTimeStarted(),
            consultation.getTimeFinished(),
            followUpId,
            consultation.getRating());
        }).collect(Collectors.toList());
  }

  /**
   * Retrieves all the doctor users.
   *
   * @return The doctor users
   */
  public List<DoctorUserResponseDTO> getAllDoctorUsers() {
    List<DoctorUserResponseDTO> doctorList = new LinkedList<>();
    List<Doctor> doctors = doctorService.getAllDoctors();

    if (doctors.size() > 0) {
      for (Doctor doctor : doctors) {
        Optional<User> optionalUser = userService.findById(doctor.getUserId());

        if (optionalUser.isPresent()) {
          User user = optionalUser.get();

          doctorList.add(
              new DoctorUserResponseDTO(
                  user.getId(),
                  user.getEmail(),
                  user.getMobile(),
                  doctor.getFirstName(),
                  doctor.getLastName(),
                  doctor.getMedicalCertificate(),
                  doctor.getHospital(),
                  doctor.getNationalIdNumber(),
                  user.getCreatedAt(),
                  user.getUpdatedAt()
              )
          );
        }
      }
    }
    return doctorList;
  }

  /**
   * Retrieves all the patient users.
   *
   * @return The patient users
   */
  public List<PatientUserResponseDTO> getAllPatientUsers() {
    List<PatientUserResponseDTO> patientList = new LinkedList<>();
    List<Patient> patients = patientService.getAll();

    if (patients.size() > 0) {
      for (Patient patient : patients) {
        Optional<User> optionalUser = userService.findById(patient.getUserId());

        if (optionalUser.isPresent()) {
          User user = optionalUser.get();

          patientList.add(
              new PatientUserResponseDTO(
                  user.getId(),
                  user.getEmail(),
                  user.getMobile(),
                  user.getCreatedAt(),
                  user.getUpdatedAt()
              )
          );
        }
      }
    }
    return patientList;
  }

  public SystemAdmin getSystemAdmin(Long userId) {
    Optional<SystemAdmin> optionalSystemAdmin = systemAdminService.getByUserIdOptional(userId);
    if (optionalSystemAdmin.isPresent()) {
      return optionalSystemAdmin.get();
    }

    throw new ResponseStatusException(HttpStatus.NOT_FOUND,
        "System admin with the provided user id could not be found");
  }
}