package com.carelyo.v1.service.patient;

import com.carelyo.v1.dto.consultation.ConsultationDTO.ActiveConsultationPatient;
import com.carelyo.v1.dto.consultation.ConsultationDTO.UnratedConsultation;
import com.carelyo.v1.dto.patient.PatientDTO;
import com.carelyo.v1.dto.patient.PatientDTO.CompletePatientProfileDTO;
import com.carelyo.v1.dto.patient.PatientDTO.UpdateProfileDTO;
import com.carelyo.v1.dto.patient.PatientProfileDTO;
import com.carelyo.v1.enums.ERelationshipRelation;
import com.carelyo.v1.model.consultation.Consultation;
import com.carelyo.v1.model.user.User;
import com.carelyo.v1.model.user.patient.Locale;
import com.carelyo.v1.model.user.patient.Location;
import com.carelyo.v1.model.user.patient.Patient;
import com.carelyo.v1.model.user.patient.Polygenic;
import com.carelyo.v1.model.wallet.Wallet;
import com.carelyo.v1.repos.user.PatientRepository;
import com.carelyo.v1.repos.user.UserRepository;
import com.carelyo.v1.service.invitation.InvitationService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.user.UserService;
import com.carelyo.v1.service.wallet.WalletService;
import com.carelyo.v1.utils.AppUtils;
import com.carelyo.v1.utils.enums.EInvitation;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.annotation.Nullable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

/**
 * Service for Patient endpoints
 */

@Service
public class PatientService {

  private final UserService userService;
  private final PatientRepository patientRepository;
  private final WalletService walletService;
  private final InvitationService invitationService;
  private final UserRepository userRepository;

  public PatientProfileDTO getUserByEmail(String email,UserDetailsImpl userDetails) {
    Optional<User> optionalLoggedInUser = userRepository.findById(userDetails.getId());
    if (optionalLoggedInUser.isPresent()) {
      User loggedInUser = optionalLoggedInUser.get();
      if (loggedInUser.getEmail().equalsIgnoreCase(email)) {
        return null;
      }
    }
    Optional<User> optionalUser = userRepository.findByEmail(email);
    if (optionalUser.isPresent()) {
      User user = optionalUser.get();
      Optional<Patient> optionalPatient = patientRepository.findByUserId(user.getId());
      if (optionalPatient.isPresent()) {
        return getPatientProfile(optionalPatient.get(), user, null, null);
      }
    }
    return null;
  }

  public PatientService(UserService userService, PatientRepository patientRepository,
      WalletService walletService, InvitationService invitationService,
      UserRepository userRepository) {
    this.userService = userService;
    this.patientRepository = patientRepository;
    this.walletService = walletService;
    this.invitationService = invitationService;
    this.userRepository = userRepository;
  }

  /**
   * Use for validating userId Usage: userId = checkUserId(userId);
   */

  public List<Patient> getAll() {
    return patientRepository.findAll();
  }

  public List<PatientDTO> getAllPatients() {

    List<PatientDTO> allPatients = new ArrayList<>();

    for (Patient patient : patientRepository.findAll()) {
      User user = userService.getUserById(patient.getUserId());

      PatientDTO patientDTO = new PatientDTO(
          patient.getUserId(),
          patient.getId(),
          user.getEmail(),
          user.getMobile(),
          user.getReferralCode(),
          user.getReferralCount(),
          user.getProfileComplete(),
          patient.getProviderId(),
          patient.getFirstName(),
          patient.getSurName()
      );
      allPatients.add(patientDTO);
    }
    return allPatients;
  }

  public Optional<Patient> getPatientById(Long id) {
    return patientRepository.findById(id);
  }

  public Patient getPatientByUserId(Long userId) {
    return patientRepository.findByUserId(userId).orElseThrow(() -> new ResponseStatusException(
        HttpStatus.NOT_FOUND, "Patient with the provided id could not be found or does not exist"));
  }

  public boolean isPatientByUserId(Long userId) {
    return patientRepository.findByUserId(userId).isPresent();
  }

  public PatientProfileDTO getPatientProfile(Patient patient, User user, Consultation consultation,
      List<UnratedConsultation> unratedConsultation) {
    return getPatientProfileDTO(
        patient,
        user,
        consultation,
        unratedConsultation
    );

  }


  public PatientProfileDTO completePatientProfile(
      Long userId,
      CompletePatientProfileDTO patientProfileDTO) {
    User user = userService.getUserById(userId);
    if (user.getProfileComplete()) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Profile already completed");
    }

    Patient patient = getPatientByUserId(userId);
    // create Location object
    Location location = new Location();
    location.setAddress(patientProfileDTO.getAddress());
    location.setCity(patientProfileDTO.getCity());
    location.setCountry(patientProfileDTO.getCountry());
    location.setState(patientProfileDTO.getState());
    location.setCommunity(patientProfileDTO.getCommunity());

    // create Locale object
    Locale locale = new Locale();
    locale.setLanguages(patientProfileDTO.getLanguage());

    // create polygenic object
    Polygenic polygenic = new Polygenic();
    polygenic.setGender(patientProfileDTO.getGender());

    // create patient object
    patient.setTitle(patientProfileDTO.getTitle());
    patient.setFirstName(patientProfileDTO.getFirstName());
    patient.setSurName(patientProfileDTO.getSurName());
    patient.setDateOfBirth(patientProfileDTO.getDateOfBirth());
    patient.setLocation(location);
    patient.setLocale(locale);
    patient.setPolygenic(polygenic);
    user.setMobile(patientProfileDTO.getMobile());
    user.setProfileComplete(true);
    patientRepository.save(patient);
    userService.save(user);
    return getPatientProfile(patient, user, null, null);
  }

  public PatientProfileDTO completeChildProfile(Long userId, UserDetailsImpl userDetails, CompletePatientProfileDTO patientProfileDTO) {

    if (!AppUtils.hasRole(userDetails, "SYSTEMADMIN") && !isChildsParent(userId, userDetails.getId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
    }
    invitationService.updateInvitationStatus(userDetails.getEmail(), EInvitation.complete);
    return completePatientProfile(userId, patientProfileDTO);

  }

  public boolean isProfileComplete(Long userId) {
    return userService.getUserById(userId).getProfileComplete();
  }

  private PatientProfileDTO getPatientProfileDTO(Patient patient, User user,
      Consultation consultation, List<UnratedConsultation> unratedConsultation) {
    ActiveConsultationPatient activeConsultation = null;
    Wallet wallet = walletService.getWalletByPatientId(patient.getUserId());
    if (consultation != null) {
      activeConsultation = new ActiveConsultationPatient(
          consultation.getId(),
          consultation.getCreatedAt(),
          consultation.getStatus(),
          consultation.getTransactionReference(),
          consultation.getTransactionUrl(),
          consultation.getConsultationUrl(),
          consultation.getConsultationType());
    }

    return new PatientProfileDTO(
        user.getId(),
        user.getEmail(),
        user.getMobile(),
        user.getProfileComplete(),

        patient.getId(),
        patient.getTitle(),
        patient.getNationalIdNumber(),
        patient.getFirstName(),
        patient.getSurName(),
        patient.getDateOfBirth(),
        patient.getMaritalStatus(),
        patient.isHasChildren(),
        patient.getNumOfChildren(),
        patient.getRelationships(),

        patient.getPolygenic(),

        patient.getAllergies(),
        patient.getMedicalProblems(),
        patient.getDisabilities(),

        patient.getLocation(),
        patient.getLocale(),

        user.getReferralCode(),
        user.getReferralCount(),
        patient.getProviderId(),
        wallet,
        activeConsultation,
        unratedConsultation,
        user.getProfilePhoto(),
        patient.getNinCard(),
        patient.getNinCardFileName(),
        patient.getCreatedAt(),
        user.getSso()
    );
  }

  public PatientProfileDTO editPatientLocale(Long userId, @Nullable UpdateProfileDTO patientProfileDTO){
    Patient patient = getPatientByUserId(userId);
    User user = userService.getUserById(userId);
    try {
      assert patientProfileDTO != null;
      if (patientProfileDTO.getLocale() != null) {
        patient.setLocale(patientProfileDTO.getLocale());
        patient.setLocation(patientProfileDTO.getLocation());
      }
    } catch (Exception e) {
      e.printStackTrace();
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Invalid request", e);
    }

    patientRepository.save(patient);
    return getPatientProfile(patient, user, null, null);
  }

  public PatientProfileDTO editPatientProfile(Long userId,
      @Nullable UpdateProfileDTO patientProfileDTO, MultipartFile ninCard) {
    Patient patient = getPatientByUserId(userId);
    User user = userService.getUserById(userId);
    if (!user.getProfileComplete()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "Profile incomplete, please complete profile first");
    }
    try {
      assert patientProfileDTO != null;
      if (patientProfileDTO.getTitle() != null) {
        patient.setTitle(patientProfileDTO.getTitle());
      }
      if (patientProfileDTO.getFirstName() != null) {
        patient.setFirstName(patientProfileDTO.getFirstName());
      }
      if (patientProfileDTO.getSurName() != null) {
        patient.setSurName(patientProfileDTO.getSurName());
      }
      if (patientProfileDTO.getMaritalStatus() != null) {
        patient.setMaritalStatus(patientProfileDTO.getMaritalStatus());
      }
      if (patientProfileDTO.getLocation() != null) {
        patient.setLocation(patientProfileDTO.getLocation());
      }
//      if (patientProfileDTO.getLocale() != null) {
//        patient.setLocale(patientProfileDTO.getLocale());
//      }
      if (patientProfileDTO.getAllergies() != null) {
        patient.setAllergies(patientProfileDTO.getAllergies());
      }
      if (patientProfileDTO.getMedicalProblems() != null) {
        patient.setMedicalProblems(patientProfileDTO.getMedicalProblems());
      }
      if (patientProfileDTO.getDisabilities() != null) {
        patient.setDisabilities(patientProfileDTO.getDisabilities());
      }
      Polygenic polygenic = patient.getPolygenic();
      if (patientProfileDTO.getGender() != null) {
        polygenic.setGender(patientProfileDTO.getGender());
      }
      if (patientProfileDTO.getBloodType() != null) {
        polygenic.setBloodType(patientProfileDTO.getBloodType());
      }
      if (patientProfileDTO.getHeightCm() != null) {
        polygenic.setHeightCm(patientProfileDTO.getHeightCm());
      }
      if (patientProfileDTO.getWeightKg() != null) {
        polygenic.setWeightKg(patientProfileDTO.getWeightKg());
      }
      patient.setPolygenic(polygenic);
      if (patientProfileDTO.getProviderId() != null) {
        patient.setProviderId(patientProfileDTO.getProviderId());
      }
      if(patientProfileDTO.getNationalIdNumber() != null) {
        patient.setNationalIdNumber(patientProfileDTO.getNationalIdNumber());
      }
      if(ninCard != null) {
        patient.setNinCard(ninCard.getBytes());
        patient.setNinCardFileName(patientProfileDTO.getNinCardFileName());
      }
    } catch (Exception e) {
      e.printStackTrace();
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Invalid request", e);
    }

    patientRepository.save(patient);
    return getPatientProfile(patient, user, null, null);

  }

  public PatientProfileDTO editChildProfile(Long userId, UserDetailsImpl userDetails, UpdateProfileDTO patientProfileDTO) {
    if (!AppUtils.hasRole(userDetails, "SYSTEMADMIN") && !isChildsParent(userId, userDetails.getId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
    }

    Patient child = getPatientByUserId(userId);

    User user = userService.getUserById(userId);
    if (!user.getProfileComplete()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "Profile incomplete, please complete profile first");
    }

    try {
      if (patientProfileDTO.getTitle() != null) {
        child.setTitle(patientProfileDTO.getTitle());
      }
      if (patientProfileDTO.getFirstName() != null) {
        child.setFirstName(patientProfileDTO.getFirstName());
      }
      if (patientProfileDTO.getSurName() != null) {
        child.setSurName(patientProfileDTO.getSurName());
      }
      if (patientProfileDTO.getMaritalStatus() != null) {
        child.setMaritalStatus(patientProfileDTO.getMaritalStatus());
      }
      if (patientProfileDTO.getLocation() != null) {
        child.setLocation(patientProfileDTO.getLocation());
      }
//      if (patientProfileDTO.getLocale() != null) {
//        child.setLocale(patientProfileDTO.getLocale());
//      }
      if (patientProfileDTO.getAllergies() != null) {
        child.setAllergies(patientProfileDTO.getAllergies());
      }
      if (patientProfileDTO.getMedicalProblems() != null) {
        child.setMedicalProblems(patientProfileDTO.getMedicalProblems());
      }
      if (patientProfileDTO.getDisabilities() != null) {
        child.setDisabilities(patientProfileDTO.getDisabilities());
      }
      Polygenic polygenic = child.getPolygenic();
      if (patientProfileDTO.getGender() != null) {
        polygenic.setGender(patientProfileDTO.getGender());
      }
      if (patientProfileDTO.getBloodType() != null) {
        polygenic.setBloodType(patientProfileDTO.getBloodType());
      }
      if (patientProfileDTO.getHeightCm() != null) {
        polygenic.setHeightCm(patientProfileDTO.getHeightCm());
      }
      if (patientProfileDTO.getWeightKg() != null) {
        polygenic.setWeightKg(patientProfileDTO.getWeightKg());
      }
      child.setPolygenic(polygenic);
      if (patientProfileDTO.getProviderId() != null) {
        child.setProviderId(patientProfileDTO.getProviderId());
      }
      if(patientProfileDTO.getNationalIdNumber() != null) {
        child.setNationalIdNumber(patientProfileDTO.getNationalIdNumber());
      }
    } catch (Exception e) {
      e.printStackTrace();
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Invalid request", e);
    }

    patientRepository.save(child);
    return getPatientProfile(child, user, null, null);
  }

  public Boolean isNationalId(String nationalId) {
    return patientRepository.findByNationalIdNumber(nationalId).isPresent();
  }

  public boolean isChildsParent(Long childUserId, Long parentUserId) {
    if (!isPatientByUserId(parentUserId)) {
      return false;
    }

    Patient parent = getPatientByUserId(parentUserId);
    return parent.getRelationships().stream()
        .filter(relationship -> {
          System.out.println(relationship.getRelation());
          return relationship.getRelation().equals(ERelationshipRelation.CHILD);
        })
        .anyMatch(relationship -> relationship.getRelatedUserId().equals(childUserId));
  }

  public Patient save(Patient patient) {
    return patientRepository.save(patient);
  }

  public List<PatientDTO> getChildren(Long userId, UserDetailsImpl userDetails) {
    if (!AppUtils.hasRole(userDetails, "SYSTEMADMIN") && !Objects.equals(userId,
        userDetails.getId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to do this");
    }

    Patient patient = getPatientByUserId(userId);

    return patient.getRelationships().stream()
        .filter(relationship -> relationship.getRelation().equals(ERelationshipRelation.CHILD))
        .map(relationship -> {
          User childUser = userService.getUserById(relationship.getRelatedUserId());
          Patient childPatient = getPatientByUserId(relationship.getRelatedUserId());
          return new PatientDTO(
              childPatient.getUserId(),
              childPatient.getId(),
              childUser.getEmail(),
              childUser.getMobile(),
              childUser.getReferralCode(),
              childUser.getReferralCount(),
              childUser.getProfileComplete(),
              childPatient.getProviderId(),
              childPatient.getFirstName(),
              childPatient.getSurName());
        })
        .collect(Collectors.toList());
  }
  public Optional<Patient> tryGetPatientByUserId(Long userId)
  {
    return patientRepository.findByUserId(userId);
  }
}