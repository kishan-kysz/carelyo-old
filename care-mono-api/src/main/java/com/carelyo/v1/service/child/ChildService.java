package com.carelyo.v1.service.child;

import com.carelyo.v1.dto.child.ChildRequestDTO;
import com.carelyo.v1.dto.child.ChildResponseDTO;
import com.carelyo.v1.dto.child.PartnerDTO;
import com.carelyo.v1.dto.child.UpdateChildRequestDTO;
import com.carelyo.v1.dto.child.UpdateChildStatusRequestDTO;
import com.carelyo.v1.dto.invitation.InvitationDTO.InvitationRequestDTO;
import com.carelyo.v1.enums.EChildStatus;
import com.carelyo.v1.model.invitation.Invitation;
import com.carelyo.v1.model.message.MessageComposer;
import com.carelyo.v1.model.message.MessageComposer.CSS;
import com.carelyo.v1.model.template.TplNotification;
import com.carelyo.v1.model.user.Partner;
import com.carelyo.v1.model.user.User;
import com.carelyo.v1.model.user.child.Child;
import com.carelyo.v1.model.user.patient.Patient;
import com.carelyo.v1.model.user.patient.Polygenic;
import com.carelyo.v1.repos.child.ChildRepository;
import com.carelyo.v1.service.email.thymeleaf_email.component.EmailSenderService;
import com.carelyo.v1.service.email.thymeleaf_email.model.Mail;
import com.carelyo.v1.service.invitation.InvitationService;
import com.carelyo.v1.service.partner.PartnerService;
import com.carelyo.v1.service.patient.PatientService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.user.UserService;
import com.carelyo.v1.utils.AppUtils;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ChildService {

  private final ChildRepository childRepository;
  private final PatientService patientService;
  private final PartnerService partnerService;
  private final UserService userService;
  private final InvitationService invitationService;
  private final EmailSenderService emailSenderService;
  @Value("${client.login.url}")
  private String LOGIN_URL;

  public ChildService(ChildRepository childRepository, PatientService patientService,
                      PartnerService partnerService, UserService userService, InvitationService invitationService,
                      EmailSenderService emailSenderService) {
    this.childRepository = childRepository;
    this.patientService = patientService;
    this.partnerService = partnerService;
    this.userService = userService;
    this.invitationService = invitationService;
    this.emailSenderService = emailSenderService;
  }

  @NotNull
  private static ChildResponseDTO getChildResponseDTO(Child child) {
    ChildResponseDTO childResponseDTO = new ChildResponseDTO();
    childResponseDTO.setChildId(child.getId());
    childResponseDTO.setName(child.getName());
    childResponseDTO.setStatus(child.getStatus().name());
    Polygenic polygenic = new Polygenic();
    polygenic.setGender(child.getPolygenic().getGender());
    polygenic.setBloodType(child.getPolygenic().getBloodType());
    polygenic.setHeightCm(child.getPolygenic().getHeightCm());
    polygenic.setWeightKg(child.getPolygenic().getWeightKg());
    childResponseDTO.setPolygenic(polygenic);
    childResponseDTO.setAllergies(child.getAllergies());
    childResponseDTO.setDisabilities(child.getDisabilities());
    childResponseDTO.setMedicalProblems(child.getMedicalProblems());
    childResponseDTO.setDateOfBirth(child.getDateOfBirth());
    if (Boolean.FALSE.equals(child.getSingleParent())) {
      childResponseDTO.setPatientId(child.getPatient().getId());
    }
    return childResponseDTO;
  }
  /**
   * add a new child.
   *
   * @param childRequestDTO dto for a new child
   */
  public ChildResponseDTO createChild(ChildRequestDTO childRequestDTO, UserDetailsImpl userDetails) {
    if (!(AppUtils.hasRole(userDetails, "SYSTEMADMIN") || AppUtils.hasRole(userDetails,
        "PATIENT"))) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
    }

    Patient patient = patientService.getPatientByUserId(userDetails.getId());

    if (Boolean.TRUE.equals(childRequestDTO.getSingleParent())) {
      Child child = saveChild(childRequestDTO, patient);
      return getChildResponseDTO(child);
    }

    // if partner email not exists invite to partner
    if (!userService.existsByEmailOrMobile(childRequestDTO.getPartnerEmailId(),
        childRequestDTO.getPartnerPhoneNumber())) {
      Child child = saveChild(childRequestDTO, patient, userDetails);
      return getChildProfile(child, patient);
    } else {
      User partner = userService.findByEmailOrMobile(childRequestDTO.getPartnerEmailId(),
              childRequestDTO.getPartnerPhoneNumber())
          .get();
      Patient partnerPatient = patientService.getPatientByUserId(partner.getId());
      sendApprovalConfirmationEmailPartner(partner.getEmail(), childRequestDTO.getName());
      Child child = saveChild(childRequestDTO, patient, partnerPatient);
      return getChildProfile(child, partnerPatient);
    }
  }

  private ChildResponseDTO getChildProfile(Child child, Patient patient) {
    ChildResponseDTO childResponseDTO = getChildResponseDTO(child);
    PartnerDTO partnerDTO = new PartnerDTO();
    User partnerUser;
    if (Boolean.TRUE.equals(child.getSingleParent())) {
      partnerDTO = null;
    } else if (child.getPartnerPatient() == null) {
      Partner partner = partnerService.findById(child.getPartner().getId()).get();
      partnerDTO.setMobile(partner.getMobile());
      partnerDTO.setEmail(partner.getEmail());
      partnerDTO.setFirstName(partner.getFirstName());
      partnerDTO.setLastName(partner.getLastName());
      partnerDTO.setId(partner.getId());
      partnerDTO.setNationalIdNumber(partner.getNationalIdNumber());
    } else if (Objects.equals(child.getPatient().getId(), patient.getId())) {
      partnerUser = userService.getUserById(child.getPartnerPatient().getUserId());
      partnerDTO.setMobile(partnerUser.getMobile());
      partnerDTO.setEmail(partnerUser.getEmail());
      partnerDTO.setFirstName(child.getPartnerPatient().getFirstName());
      partnerDTO.setLastName(child.getPartnerPatient().getSurName());
      partnerDTO.setId(child.getPartnerPatient().getId());
      partnerDTO.setNationalIdNumber(child.getPartnerPatient().getNationalIdNumber());
    } else {
      partnerUser = userService.getUserById(child.getPatient().getUserId());
      partnerDTO.setMobile(partnerUser.getMobile());
      partnerDTO.setEmail(partnerUser.getEmail());
      partnerDTO.setFirstName(child.getPatient().getFirstName());
      partnerDTO.setLastName(child.getPatient().getSurName());
      partnerDTO.setId(child.getPatient().getId());
      partnerDTO.setNationalIdNumber(child.getPatient().getNationalIdNumber());
    }
    childResponseDTO.setPartner(partnerDTO);
    return childResponseDTO;
  }

  public ChildResponseDTO getChildById(Long childId, UserDetailsImpl userDetails) {
    if (!(AppUtils.hasRole(userDetails, "SYSTEMADMIN") || AppUtils.hasRole(userDetails,
        "PATIENT"))) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
    }

    Patient patient = patientService.getPatientByUserId(userDetails.getId());
    Child child = childRepository.findById(childId).get();
    return getChildProfile(child, patient);
  }

  public Optional<Child> getChildById(Long childId) {
    return childRepository.findById(childId);
  }

  public List<Child> getActiveChildren(UserDetailsImpl userDetails) {
    if (!(AppUtils.hasRole(userDetails, "SYSTEMADMIN") || AppUtils.hasRole(userDetails,
        "PATIENT"))) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
    }

    Patient patient = patientService.getPatientByUserId(userDetails.getId());
    return childRepository.findByStatusAndPatientOrPartnerPatient(EChildStatus.APPROVED,
          patient, patient);
  }

  public List<ChildResponseDTO> getChildren(UserDetailsImpl userDetails, boolean isActive) {
    if (!(AppUtils.hasRole(userDetails, "SYSTEMADMIN") || AppUtils.hasRole(userDetails,
        "PATIENT"))) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
    }

    List<ChildResponseDTO> childResponseDTOList = new ArrayList<>();
    Patient patient = patientService.getPatientByUserId(userDetails.getId());
    List<Child> childList;
    if (isActive) {
      childList = childRepository.findByStatusAndPatientOrPartnerPatient(EChildStatus.APPROVED,
          patient, patient);
    } else {
      childList = childRepository.findByPatientOrPartnerPatient(
          patient, patient);
    }
    for (Child child : childList) {
      ChildResponseDTO childResponseDTO = new ChildResponseDTO();
      childResponseDTO.setChildId(child.getId());
      childResponseDTO.setName(child.getName());
      childResponseDTO.setStatus(child.getStatus().name());
      Polygenic polygenic = new Polygenic();
      polygenic.setGender(child.getPolygenic().getGender());
      polygenic.setBloodType(child.getPolygenic().getBloodType());
      polygenic.setHeightCm(child.getPolygenic().getHeightCm());
      polygenic.setWeightKg(child.getPolygenic().getWeightKg());
      childResponseDTO.setPolygenic(polygenic);
      childResponseDTO.setAllergies(child.getAllergies());
      childResponseDTO.setDisabilities(child.getDisabilities());
      childResponseDTO.setMedicalProblems(child.getMedicalProblems());
      childResponseDTO.setDateOfBirth(child.getDateOfBirth());
      childResponseDTO.setPatientId(child.getPatient().getId());
      childResponseDTO.setNotes(child.getNotes());
      PartnerDTO partnerDTO = new PartnerDTO();
      User partnerUser;
      if (Boolean.TRUE.equals(child.getSingleParent())) {
        partnerDTO = null;
      } else if (child.getPartnerPatient() == null) {
        Partner partner = partnerService.findById(child.getPartner().getId()).get();
        partnerDTO.setMobile(partner.getMobile());
        partnerDTO.setEmail(partner.getEmail());
        partnerDTO.setFirstName(partner.getFirstName());
        partnerDTO.setLastName(partner.getLastName());
        partnerDTO.setId(partner.getId());
        partnerDTO.setNationalIdNumber(partner.getNationalIdNumber());
      } else if (Objects.equals(child.getPatient().getId(), patient.getId())) {
        partnerUser = userService.getUserById(child.getPartnerPatient().getUserId());
        partnerDTO.setMobile(partnerUser.getMobile());
        partnerDTO.setEmail(partnerUser.getEmail());
        partnerDTO.setFirstName(child.getPartnerPatient().getFirstName());
        partnerDTO.setLastName(child.getPartnerPatient().getSurName());
        partnerDTO.setId(child.getPartnerPatient().getId());
        partnerDTO.setNationalIdNumber(child.getPartnerPatient().getNationalIdNumber());
      } else {
        partnerUser = userService.getUserById(child.getPatient().getUserId());
        partnerDTO.setMobile(partnerUser.getMobile());
        partnerDTO.setEmail(partnerUser.getEmail());
        partnerDTO.setFirstName(child.getPatient().getFirstName());
        partnerDTO.setLastName(child.getPatient().getSurName());
        partnerDTO.setId(child.getPatient().getId());
        partnerDTO.setNationalIdNumber(child.getPatient().getNationalIdNumber());
      }
      childResponseDTO.setPartner(partnerDTO);
      childResponseDTOList.add(childResponseDTO);
    }
    return childResponseDTOList;
  }

  public Child saveChild(ChildRequestDTO childrenSignupDTO, Patient patient) {
    try {
      Child child = new Child();
      child.setBirthCertificate(childrenSignupDTO.getBirthCertificate().getBytes());
      child.setBirthCertFileName(childrenSignupDTO.getBirthCertFileName());
      if (childrenSignupDTO.getNINCard() != null) {
        child.setNINCard(childrenSignupDTO.getNINCard().getBytes());
        child.setNinCardFileName(childrenSignupDTO.getNinCardFileName());
      }
      Polygenic polygenic = new Polygenic();
      polygenic.setGender(childrenSignupDTO.getGender());
      child.setPolygenic(polygenic);
      child.setName(childrenSignupDTO.getName());
      child.setDateOfBirth(
          childrenSignupDTO.getDateOfBirth().toInstant().atZone(ZoneId.systemDefault())
              .toLocalDateTime());
      child.setSingleParent(Boolean.TRUE);
      child.setPatient(patient);
      child.setStatus(EChildStatus.APPROVED);
      return childRepository.save(child);
    } catch (Exception exception) {
      return null;
    }
  }

  public Child saveChild(ChildRequestDTO childRequestDTO, Patient parent,
                         UserDetailsImpl userDetails) {

    try {
      Partner savedPartner;
      if (!partnerService.existsByEmailOrMobile(childRequestDTO.getPartnerEmailId(),
          childRequestDTO.getPartnerPhoneNumber())) {
        Invitation invitation = invitationService.createInvitation(
            new InvitationRequestDTO(childRequestDTO.getPartnerFirstName(),
                childRequestDTO.getPartnerEmailId()), userDetails.getId());
        invitationService.sendInvitation(invitation, userDetails.getReferralCode());
        Partner partner = new Partner();
        partner.setEmail(childRequestDTO.getPartnerEmailId());
        partner.setFirstName(childRequestDTO.getPartnerFirstName());
        partner.setLastName(childRequestDTO.getPartnerLastName());
        partner.setMobile(childRequestDTO.getPartnerPhoneNumber());
        partner.setNationalIdNumber(childRequestDTO.getPartnerNationalIdNumber());
        savedPartner = partnerService.savePartner(partner);
      } else {
        savedPartner = partnerService.findByEmailOrMobile(childRequestDTO.getPartnerEmailId(),
            childRequestDTO.getPartnerPhoneNumber()).get();
      }

      Child child = new Child();
      child.setBirthCertificate(childRequestDTO.getBirthCertificate().getBytes());
      child.setBirthCertFileName(childRequestDTO.getBirthCertFileName());
      if (childRequestDTO.getNINCard() != null) {
        child.setNINCard(childRequestDTO.getNINCard().getBytes());
        child.setNinCardFileName(childRequestDTO.getNinCardFileName());
      }
      Polygenic polygenic = new Polygenic();
      polygenic.setGender(childRequestDTO.getGender());
      child.setPolygenic(polygenic);
      child.setName(childRequestDTO.getName());
      child.setPatient(parent);
      child.setPartner(savedPartner);
      child.setDateOfBirth(
          childRequestDTO.getDateOfBirth().toInstant().atZone(ZoneId.systemDefault())
              .toLocalDateTime());
      child.setStatus(EChildStatus.PENDING);
      child.setSingleParent(Boolean.FALSE);
      return childRepository.save(child);
    } catch (Exception exception) {
      System.err.println("-------------------------");
      System.err.println(exception.getMessage());
      return null;
    }
  }

  public Child saveChild(ChildRequestDTO childrenSignupDTO, Patient patient,
                         Patient partnerPatient) {

    try {
      Child child = new Child();
      child.setBirthCertificate(childrenSignupDTO.getBirthCertificate().getBytes());
      child.setBirthCertFileName(childrenSignupDTO.getBirthCertFileName());
      if (childrenSignupDTO.getNINCard() != null) {
        child.setNINCard(childrenSignupDTO.getNINCard().getBytes());
        child.setNinCardFileName(childrenSignupDTO.getNinCardFileName());
      }
      Polygenic polygenic = new Polygenic();
      polygenic.setGender(childrenSignupDTO.getGender());
      child.setPolygenic(polygenic);
      child.setName(childrenSignupDTO.getName());
      child.setPatient(patient);
      child.setPartnerPatient(partnerPatient);
      child.setDateOfBirth(
          childrenSignupDTO.getDateOfBirth().toInstant().atZone(ZoneId.systemDefault())
              .toLocalDateTime());
      child.setStatus(EChildStatus.PENDING);
      child.setSingleParent(Boolean.FALSE);
      return childRepository.save(child);
    } catch (Exception exception) {
      System.err.println("-------------------------");
      System.err.println(exception.getMessage());
      return null;
    }
  }

  public void updateChild(UpdateChildRequestDTO updateChildRequestDTO,
                          UserDetailsImpl userDetails) {
    if (!(AppUtils.hasRole(userDetails, "SYSTEMADMIN") || AppUtils.hasRole(userDetails,
        "PATIENT"))) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
    }

    Child child = childRepository.findById(updateChildRequestDTO.getChildId()).get();
    if (updateChildRequestDTO.getName() != null) {
      child.setName(updateChildRequestDTO.getName());
    }
    if (updateChildRequestDTO.getDateOfBirth() != null) {
      child.setDateOfBirth(
          updateChildRequestDTO.getDateOfBirth().toInstant().atZone(ZoneId.systemDefault())
              .toLocalDateTime());
    }
    if (updateChildRequestDTO.getPolygenic() != null) {
      Polygenic polygenic = child.getPolygenic();
      if (updateChildRequestDTO.getPolygenic().getGender() != null) {
        polygenic.setGender(updateChildRequestDTO.getPolygenic().getGender());
      }
      if (updateChildRequestDTO.getPolygenic().getWeightKg() != null) {
        polygenic.setWeightKg(updateChildRequestDTO.getPolygenic().getWeightKg());
      }
      if (updateChildRequestDTO.getPolygenic().getHeightCm() != null) {
        polygenic.setHeightCm(updateChildRequestDTO.getPolygenic().getHeightCm());
      }
      if (updateChildRequestDTO.getPolygenic().getBloodType() != null) {
        polygenic.setBloodType(updateChildRequestDTO.getPolygenic().getBloodType());
      }
      child.setPolygenic(polygenic);
    }
    if (updateChildRequestDTO.getAllergies() != null) {
      child.setAllergies(updateChildRequestDTO.getAllergies());
    }
    if (updateChildRequestDTO.getDisabilities() != null) {
      child.setDisabilities(updateChildRequestDTO.getDisabilities());
    }
    if (updateChildRequestDTO.getMedicalProblems() != null) {
      child.setMedicalProblems(updateChildRequestDTO.getMedicalProblems());
    }

    if (Boolean.FALSE.equals(child.getSingleParent())) {
      User userByEmail = userService.findByEmail(updateChildRequestDTO.getPartner().getEmail());
      if (userByEmail != null) {
        Patient patient = patientService.getPatientByUserId(userByEmail.getId());
        child.setPartnerPatient(patient);
        child.setPartner(null);
      } else {
        Optional<Partner> optionalPartner = partnerService.findByEmailOrMobile(
            updateChildRequestDTO.getPartner().getEmail(),
            updateChildRequestDTO.getPartner().getMobile());
        if (optionalPartner.isPresent()) {

          Partner partner = optionalPartner.get();
          child.setPartner(partner);
          child.setPartnerPatient(null);
        } else {
          if (child.getPartner().getId() != null) {
            Partner partner = partnerService.findById(child.getPartner().getId()).get();
            partner.setEmail(updateChildRequestDTO.getPartner().getEmail());
            partner.setMobile(updateChildRequestDTO.getPartner().getMobile());
            partner.setFirstName(updateChildRequestDTO.getPartner().getFirstName());
            partner.setLastName(updateChildRequestDTO.getPartner().getLastName());
            partner.setNationalIdNumber(updateChildRequestDTO.getPartner().getNationalIdNumber());
            partnerService.savePartner(partner);
          } else{
            Partner partner = new Partner();
            partner.setEmail(updateChildRequestDTO.getPartner().getEmail());
            partner.setFirstName(updateChildRequestDTO.getPartner().getFirstName());
            partner.setLastName(updateChildRequestDTO.getPartner().getLastName());
            partner.setMobile(updateChildRequestDTO.getPartner().getMobile());
            partner.setNationalIdNumber(updateChildRequestDTO.getPartner().getNationalIdNumber());
          }
        }
      }
    }
    childRepository.save(child);
  }

  public List<Child> findByPartner(Partner partner) {
    return childRepository.findByPartner(partner);
  }

  public void updatePartnerPatient(List<Child> childList, Patient patient) {
    List<Long> childIds = childList.stream()
        .map(Child::getId)
        .collect(Collectors.toList());
    childRepository.updatePartnerPatientInId(patient, childIds);
  }

  public void updateChidStatus(UpdateChildStatusRequestDTO updateChildStatusRequestDTO,
                               UserDetailsImpl userDetails) {
    if (!(AppUtils.hasRole(userDetails, "SYSTEMADMIN") || AppUtils.hasRole(userDetails,
        "PATIENT"))) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
    }

    Patient patient = patientService.getPatientByUserId(userDetails.getId());
    Optional<Child> optionalChild = childRepository.findById(
        updateChildStatusRequestDTO.getChildId());
    if (optionalChild.isPresent()) {
      Child child = optionalChild.get();
      if (Objects.equals(patient.getId(), child.getPartnerPatient().getId())) {
        child.setStatus(updateChildStatusRequestDTO.getStatus());
        if (updateChildStatusRequestDTO.getStatus() == EChildStatus.DECLINED) {
          child.setNotes(updateChildStatusRequestDTO.getNotes());
        }
      } else if (Objects.equals(patient.getId(), child.getPatient().getId())) {
        if (child.getStatus() == EChildStatus.DECLINED) {
          child.setNotes(updateChildStatusRequestDTO.getNotes());
        }
        child.setStatus(updateChildStatusRequestDTO.getStatus());
      }
      childRepository.save(child);
    }
  }

  public void sendApprovalConfirmationEmailPartner(String emailAddress,
                                                   String childName) {
    TplNotification tpl = new TplNotification();
    tpl.setLoginLink(LOGIN_URL);

    MessageComposer msgComposer = new MessageComposer(tpl);

    // Send a Mail
    Mail mail = new Mail(emailAddress, tpl.getSubject());
    emailSenderService.sendComposedEmail(msgComposer.createMessage(CSS.MAIL), mail);
  }

}
