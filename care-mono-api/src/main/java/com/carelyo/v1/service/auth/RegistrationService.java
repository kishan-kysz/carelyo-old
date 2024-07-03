package com.carelyo.v1.service.auth;

import com.carelyo.v1.dto.auth.SignupDTO;
import com.carelyo.v1.dto.auth.SignupDTO.PatientSignupDTO;
import com.carelyo.v1.enums.ERelationshipRelation;
import com.carelyo.v1.model.message.MessageComposer;
import com.carelyo.v1.model.message.MessageComposer.CSS;
import com.carelyo.v1.model.role.ERole;
import com.carelyo.v1.model.template.TplWelcomeDoctor;
import com.carelyo.v1.model.template.TplWelcomePatient;
import com.carelyo.v1.model.user.Partner;
import com.carelyo.v1.model.user.SystemAdmin;
import com.carelyo.v1.model.user.User;
import com.carelyo.v1.model.user.child.Child;
import com.carelyo.v1.model.user.patient.Patient;
import com.carelyo.v1.model.user.patient.Relationship;
import com.carelyo.v1.service.child.ChildService;
import com.carelyo.v1.service.doctor.DoctorService;
import com.carelyo.v1.service.email.thymeleaf_email.component.EmailSenderService;
import com.carelyo.v1.service.email.thymeleaf_email.model.Mail;
import com.carelyo.v1.service.partner.PartnerService;
import com.carelyo.v1.service.patient.PatientService;
import com.carelyo.v1.service.provider.ProviderService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.user.ReferralCodeService;
import com.carelyo.v1.service.user.SystemAdminService;
import com.carelyo.v1.service.user.UserService;
import com.carelyo.v1.service.wallet.WalletService;
import com.carelyo.v1.utils.AppUtils;
import java.util.List;
import java.util.Optional;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@PropertySource(value = {"classpath:application.properties"})
public class RegistrationService {

  private final PasswordEncoder passwordEncoder;
  private final PatientService patientService;
  private final SystemAdminService systemAdminService;
  private final ReferralCodeService referralCodeService;
  private final EmailSenderService emailSenderService;
  private final DoctorService doctorService;
  private final UserService userService;
  private final WalletService walletService;
  private final ProviderService providerService;
  private final PartnerService partnerService;
  private final ChildService childService;

  @Value("${client.login.url}")
  private String LOGIN_URL;

  public RegistrationService(
      PasswordEncoder passwordEncoder,
      PatientService patientService,
      SystemAdminService systemAdminService, EmailSenderService emailSenderService,
      ReferralCodeService referralCodeService, DoctorService doctorService,
      UserService userService,
      WalletService walletService,
      ProviderService providerService, PartnerService partnerService, ChildService childService) {

    this.passwordEncoder = passwordEncoder;
    this.patientService = patientService;
    this.systemAdminService = systemAdminService;
    this.referralCodeService = referralCodeService;
    this.emailSenderService = emailSenderService;
    this.doctorService = doctorService;
    this.userService = userService;
    this.walletService = walletService;
    this.providerService = providerService;
    this.partnerService = partnerService;
    this.childService = childService;
  }

  /**
   * Register a new patient
   *
   * @param patientSignupDTO SignupDTO
   */
  public void registerPatient(SignupDTO.PatientSignupDTO patientSignupDTO) {

    if (!patientSignupDTO.getConsent()) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You must agree to the terms of service before continuing");
    }

    if (userService.existsByEmailOrMobile(patientSignupDTO.getEmail(),
        patientSignupDTO.getMobile())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "Email or mobile already registered. Try login instead");
    }

    String password = "";
    Boolean sso = patientSignupDTO.getSso() != null ? patientSignupDTO.getSso() : Boolean.FALSE;
    if (Boolean.FALSE.equals(sso)) {
      password = AppUtils.generateCommonLangPassword();
    }

    String referralCode = referralCodeService.generateReferralCode(patientSignupDTO.getEmail());
    User user = new User(
        patientSignupDTO.getEmail(),
        passwordEncoder.encode(password),
        patientSignupDTO.getMobile(),
        referralCode,
        patientSignupDTO.getConsent(),
        sso,
        patientSignupDTO.getProfilePhoto());

    user = userService.addRoleToUser(user, ERole.PATIENT);
    userService.incrementReferralCount(patientSignupDTO.getReferralCode());
    Patient patient = new Patient(user.getId());
    patient.setProviderId(1L);
    patient.setFirstName(patientSignupDTO.getFirstName());
    patient.setSurName(patientSignupDTO.getLastName());
    Patient savedPatient = patientService.save(patient);
    if (partnerService.existsByEmailOrMobile(patientSignupDTO.getEmail(),
        patientSignupDTO.getMobile())) {
      Partner partner = partnerService.findByEmailOrMobile(patientSignupDTO.getEmail(),
          patientSignupDTO.getMobile()).get();
      List<Child> child = childService.findByPartner(partner);
      childService.updatePartnerPatient(child, savedPatient);
      partnerService.deleteById(partner.getId());
    }
    walletService.createWallet(user.getId());

    if (Boolean.FALSE.equals(sso)) {
      sendWelcomeEmailPatient(user.getEmail(), password);
    }
  }

  /**
   * Register a doctor
   *
   * @param doctorSignUpDTO doctor signup dto
   */
  public void registerDoctor(@Valid SignupDTO.DoctorSignupDTO doctorSignUpDTO) {
    if (userService.existsByEmailOrMobile(doctorSignUpDTO.getEmail(),
        doctorSignUpDTO.getMobile())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "Email or mobile already registered. Try login instead");
    }
    if (doctorService.getByNationalIdNumberOrMdcn(doctorSignUpDTO.getNationalIdNumber(),
        doctorSignUpDTO.getMedicalCertificate().getCertificateNumber()).isPresent()) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "Doctor with that certificate or national id already exists");
    }

    if (!providerService.checkIfProviderExists
        (doctorSignUpDTO.getProviderId())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Provider does not exist");
    }

    String password = AppUtils.generateCommonLangPassword();

    String referralCode = referralCodeService.generateReferralCode(
        doctorSignUpDTO.getFirstName() + doctorSignUpDTO.getLastName());
    User user = new User(
        doctorSignUpDTO.getEmail(),
        passwordEncoder.encode(password),
        doctorSignUpDTO.getMobile(), referralCode, true, false, null);

    user = userService.addRoleToUser(user, ERole.DOCTOR);

    sendWelcomeEmailDoctor(user.getEmail(), password, doctorSignUpDTO.getLastName());
    walletService.createWallet(user.getId());
    doctorService.createDoctor(doctorSignUpDTO, user.getId());
  }

  /**
   * Registers a new admin account.
   *
   * @param adminSignUpDTO dto for an admin signup
   */
  public void registerAdmin(SignupDTO.AdminSignupDTO adminSignUpDTO) {
    Optional<User> userExists = userService.findByEmailOrMobile(adminSignUpDTO.getEmail(),
        adminSignUpDTO.getMobile());
    if (userExists.isPresent()) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "Email or mobile already registered. Try login instead");
    }

    String referralCode = referralCodeService.generateReferralCode(
        adminSignUpDTO.getFirstName());

    User user = new User(
        adminSignUpDTO.getEmail(),
        passwordEncoder.encode(adminSignUpDTO.getPassword()),
        adminSignUpDTO.getMobile(), referralCode, false, null, null);

    user = userService.addRoleToUser(user, ERole.SYSTEMADMIN);
    systemAdminService.save(new SystemAdmin(user.getId(), adminSignUpDTO.getFirstName(),
        adminSignUpDTO.getLastName()));
  }

  public void registerUser(SignupDTO.UserSignupDTO userSignUpDTO) {
    String role = userSignUpDTO.getRole().toString().toLowerCase();
    switch (role) {
      case "patient":
        registerPatient(new SignupDTO.PatientSignupDTO(userSignUpDTO.getEmail(),
            userSignUpDTO.getMobile(), userSignUpDTO.getFirstName(), userSignUpDTO.getLastName(),
            "", true, false, null));

        break;
      case "doctor":
        registerDoctor(new SignupDTO.DoctorSignupDTO(userSignUpDTO.getMobile(),
            userSignUpDTO.getEmail(), userSignUpDTO.getFirstName(),
            userSignUpDTO.getLastName(), userSignUpDTO.getMedicalCertificate(),
            userSignUpDTO.getNationalIdNumber(), userSignUpDTO.getHospital(),
            userSignUpDTO.getConsent(), userSignUpDTO.getProviderId()));

        break;
      case "admin":
        registerAdmin(new SignupDTO.AdminSignupDTO(userSignUpDTO.getEmail(),
            userSignUpDTO.getPassword(),
            userSignUpDTO.getMobile(), userSignUpDTO.getFirstName(),
            userSignUpDTO.getLastName(), Boolean.FALSE));

        break;

      default:
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
            "Could not  create account, Please make sure you are sending correct properties");
    }
  }

  public void sendWelcomeEmailPatient(String emailAddress, String password) {
    TplWelcomePatient tpl = new TplWelcomePatient();
    tpl.setPwd(password);
    tpl.setLoginLink(LOGIN_URL);

    MessageComposer msgComposer = new MessageComposer(tpl);

    // Send a Mail
    Mail mail = new Mail(emailAddress, tpl.getSubject());
    emailSenderService.sendComposedEmail(msgComposer.createMessage(CSS.MAIL), mail);
  }

  public void sendWelcomeEmailDoctor(String emailAddress, String password,
      String doctorLastName) {
    TplWelcomeDoctor tpl = new TplWelcomeDoctor();
    tpl.setDoctorLastName(doctorLastName);
    tpl.setPwd(password);
    tpl.setLoginLink(LOGIN_URL);

    MessageComposer msgComposer = new MessageComposer(tpl);

    // Send a Mail
    Mail mail = new Mail(emailAddress, tpl.getSubject());
    emailSenderService.sendComposedEmail(msgComposer.createMessage(CSS.MAIL), mail);
  }

  public void registerChild(PatientSignupDTO childSignupDTO, UserDetailsImpl userDetails) {
    if (!childSignupDTO.getConsent()) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You must agree to the terms of service before continuing");
    }

    if (userService.existsByEmailOrMobile(childSignupDTO.getEmail(),
        childSignupDTO.getMobile())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "Email or mobile already registered. Try login instead");
    }

    String password = AppUtils.generateCommonLangPassword();

    String referralCode = referralCodeService.generateReferralCode(childSignupDTO.getEmail());
    User user = new User(
        childSignupDTO.getEmail(),
        passwordEncoder.encode(password),
        childSignupDTO.getMobile(),
        referralCode,
        childSignupDTO.getConsent(), false, null);

    user = userService.addRoleToUser(user, ERole.CHILD);
    userService.incrementReferralCount(childSignupDTO.getReferralCode());

    Patient child = new Patient(user.getId());
    Patient parent = patientService.getPatientByUserId(userDetails.getId());

    child.getRelationships()
        .add(new Relationship(ERelationshipRelation.PARENT, parent.getUserId()));
    parent.getRelationships().add(new Relationship(ERelationshipRelation.CHILD, child.getUserId()));

    parent.setNumOfChildren(parent.getNumOfChildren() + 1);
    parent.setHasChildren(true);

    patientService.save(child);
    patientService.save(parent);

    walletService.createWallet(user.getId());

    TplWelcomePatient tpl = new TplWelcomePatient();
    tpl.setPwd(password);
    tpl.setLoginLink(LOGIN_URL);

    MessageComposer msgComposer = new MessageComposer(tpl);

    Mail mail = new Mail(user.getEmail(), tpl.getSubject());

    emailSenderService.sendComposedEmail(msgComposer.createMessage(CSS.MAIL), mail);
  }
}