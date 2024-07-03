package com.carelyo.v1.service.consultation;


import com.carelyo.v1.dto.consultation.ConsultationDTO.BookedConsultationResponse;
import com.carelyo.v1.dto.consultation.ConsultationDTO.UnratedConsultation;
import com.carelyo.v1.dto.patient.PatientDTO.PatientAgeAndGenderDTO;
import com.carelyo.v1.dto.user.MessageDTO;
import com.carelyo.v1.dto.user.MessageDTO.CreateUserSpecificMessage;
import com.carelyo.v1.enums.EConsultationStatus;
import com.carelyo.v1.model.consultation.Consultation;
import com.carelyo.v1.model.consultation.ConsultationSorter;
import com.carelyo.v1.model.message.MessageComposer;
import com.carelyo.v1.model.message.MessageComposer.CSS;
import com.carelyo.v1.model.role.ERole;
import com.carelyo.v1.model.template.TplCanceledConsultationByDoctor;
import com.carelyo.v1.model.template.TplCanceledConsultationByPatient;
import com.carelyo.v1.model.user.child.Child;
import com.carelyo.v1.model.user.doctor.Doctor;
import com.carelyo.v1.model.user.patient.Patient;
import com.carelyo.v1.model.wallet.ETransactionType;
import com.carelyo.v1.model.wallet.Transaction;
import com.carelyo.v1.model.wallet.Wallet;
import com.carelyo.v1.repos.consultation.ConsultationRepository;
import com.carelyo.v1.service.child.ChildService;
import com.carelyo.v1.service.doctor.DoctorService;
import com.carelyo.v1.service.email.thymeleaf_email.component.EmailSenderService;
import com.carelyo.v1.service.email.thymeleaf_email.model.Mail;
import com.carelyo.v1.service.external.DailyVideoService;
import com.carelyo.v1.service.external.MinioAdapter;
import com.carelyo.v1.service.patient.PatientService;
import com.carelyo.v1.service.payout.PayoutService;
import com.carelyo.v1.service.provider.ProviderService;
import com.carelyo.v1.service.security.AccessService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.user.MessageService;
import com.carelyo.v1.service.user.UserService;
import com.carelyo.v1.service.wallet.WalletService;
import com.carelyo.v1.utils.AppUtils;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@Log4j2
public class ConsultationService {

  private final UserService userService;
  private final ConsultationRepository consultationRepository;
  private final AccessService accessService;
  private final DailyVideoService dailyVideoService;
  private final WalletService walletService;
  private final DoctorService doctorService;
  private final PatientService patientService;
  private final ProviderService providerService;
  private final EmailSenderService emailSenderService;
  private final MessageService messageService;
  @Value("${client.login.url}")
  private String LOGIN_URL;
  private final PayoutService payoutService;
  private final MinioAdapter minioAdapter;
  private final ChildService childService;

  public ConsultationService(
      ConsultationRepository consultationRepository,
      AccessService accessService,
      DailyVideoService dailyVideoService,
      WalletService walletService,
      UserService userService,
      PatientService patientService,
      DoctorService doctorService,
      ProviderService providerService,
      EmailSenderService emailSenderService,
      MessageService messageService,
      PayoutService payoutService,
      MinioAdapter minioAdapter, ChildService childService) {

    this.consultationRepository = consultationRepository;
    this.accessService = accessService;
    this.dailyVideoService = dailyVideoService;
    this.walletService = walletService;
    this.userService = userService;
    this.patientService = patientService;
    this.doctorService = doctorService;
    this.providerService = providerService;
    this.emailSenderService = emailSenderService;
    this.messageService = messageService;
    this.payoutService = payoutService;
    this.minioAdapter = minioAdapter;
    this.childService = childService;
  }

  // Method used by Quartz job
  public void statusAcceptedToBooked(Long consultationId) {
    Consultation consultation = getConsultation(consultationId);
    if (consultation.getStatus().equals(EConsultationStatus.accepted)) {
      consultation.setStatus(EConsultationStatus.booked);
      dailyVideoService.deleteRoom(consultation.getRoomName());
      consultation.setConsultationUrl(null);
      consultation.setRoomName(null);
      consultation.setDoctorId(0L);
      consultationRepository.save(consultation);
    }
  }

  public void statusToIncomplete(long consultationId) {
    Consultation consultation = getConsultation(consultationId);
    if (consultation.getStatus().equals(EConsultationStatus.started)) {
      consultation.setStatus(EConsultationStatus.incomplete);
      consultationRepository.save(consultation);
    }
  }


  public List<Consultation> getAllConsultations() {
    return new ArrayList<>(consultationRepository.findAll());
  }

  public Consultation getConsultation(Long consultationId) {
    if (consultationRepository.findById(consultationId).isPresent()) {
      return consultationRepository.findById(consultationId).get();
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation not found");
  }

  public List<BookedConsultationResponse> getAllBookedConsultations() {
    List<Consultation> consultationSorter = consultationRepository.findAllByStatus(EConsultationStatus.booked,
        Sort.by("timeBooked").ascending());
    return consultationSorter.stream()
        .map((consultation) -> {
          PatientAgeAndGenderDTO patient;
          if(consultation.getChildId() != null) {
            patient = childService.getChildById(consultation.getChildId())
                .map(Child::getAgeAndGender).orElse(null);
          } else {
            patient = patientService.getPatientByUserId(consultation.getPatientId())
                .getAgeAndGender();
            return new BookedConsultationResponse(consultation, patient);
          }
          return new BookedConsultationResponse(consultation, patient);
        }).collect(Collectors.toList());
  }

  public List<Consultation> getAllAcceptedConsultations(Long doctorId) {
    if (!consultationRepository.findAllByDoctorId(doctorId).isEmpty()) {
      return new ArrayList<>(
          new ConsultationSorter(
              consultationRepository.findAllByDoctorId(doctorId).stream()
                  .filter(Consultation::getAcceptedConsultations)
                  .collect(Collectors.toList()))
              .getSortedConsultationsByTimeAccepted());
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND,
        "No consultations with that doctor could be found");
  }


  public List<Consultation> findAllByDoctorId(Long doctorId){

    return consultationRepository.findAllByDoctorId(doctorId);
  }

  public void removeFollowUp(Long consultationId) {
    Consultation consultation = getConsultation(consultationId);
    consultation.setFollowUp(null);
    consultationRepository.save(consultation);
  }

  public List<Consultation> getFinishedConsultationsByPatientId(Long patientId,
      UserDetailsImpl userDetails) {
    if (accessService.checkUserAuthorization("typeId", patientId, userDetails) ||
        accessService.accessByRole(userDetails, new ERole[]{ERole.SYSTEMADMIN}) ||
        accessService.accessByRole(userDetails, new ERole[]{ERole.DOCTOR})) {

      if (patientService.isPatientByUserId(patientId)) {
        return new ArrayList<>(new ConsultationSorter(
            consultationRepository.findAll().stream()
                .filter(consultation -> consultation.getStatus().equals(
                    EConsultationStatus.finished)
                    && consultation.getPatientId().equals(patientId))
                .collect(Collectors.toList()))
            .getSortedConsultationsByTimeFinished());
      }

      throw new ResponseStatusException(HttpStatus.NOT_FOUND,
          "Patient with the provided id could not be found.");
    }

    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
        "You are not authorized to access this resource");
  }


  public Consultation getActiveConsultation(String roomName, Long userId) {
    Consultation consultation = consultationRepository.findByRoomName(roomName).orElseThrow(
        () -> new ResponseStatusException(HttpStatus.NOT_FOUND,
            "Consultation does not exist"));
    if (List.of(new EConsultationStatus[]{
        EConsultationStatus.booked, EConsultationStatus.accepted
    }).contains(consultation.getStatus()) && !consultation.getDoctorId().equals(userId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You do not have access to this consultation");
    }
    if (consultation.getStatus().equals(EConsultationStatus.finished)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "Consultation has been completed");
    }
    if (consultation.getStatus().equals(EConsultationStatus.canceled)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "Consultation has been canceled");
    }

    return consultation;
  }

  public List<Consultation> getAllConsultationsByTimeBookedBetween(LocalDateTime startDate,
      LocalDateTime endDate) {

    Optional<List<Consultation>> optionalConsultations =
        consultationRepository.findAllByTimeBookedBetween(startDate, endDate);

    return optionalConsultations.orElseGet(ArrayList::new);
  }

  public Optional<List<Consultation>> getAllByTimeFinishedBetween(long startDate, long endDate) {
    return consultationRepository.findAllByTimeFinishedBetween(startDate, endDate);
  }

  public List<Consultation> getAllConsultationsByStatus(EConsultationStatus status) {
    Optional<List<Consultation>> optionalConsultations =
        consultationRepository.findAllByStatus(status);

    return optionalConsultations.orElseGet(ArrayList::new);
  }

  public List<Consultation> getDoctorsConsultationByStatus(EConsultationStatus status, Long id) {
    Optional<List<Consultation>> optionalConsultations =
        consultationRepository.findAllByStatusAndDoctorId(status, id);
    return optionalConsultations.orElseGet(ArrayList::new);
  }

  public List<String> getImagesUrls(Long consultationId) {
    Optional<Consultation> optionalConsultation = consultationRepository.findById(
        consultationId);
    if (optionalConsultation.isPresent()) {
      try {
        return minioAdapter.getFilesURLs(optionalConsultation.get());
      } catch (Exception e) {
        e.printStackTrace();
        throw new ResponseStatusException(HttpStatus.I_AM_A_TEAPOT,
            "Minio Error:" + e.getMessage());
      }
    }
    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
        "Could not find consultation with id: " + consultationId);
  }

  public double cancelConsultation(long consultationId, UserDetailsImpl userDetails) {
    double balance = 0;

    Consultation consultation = consultationRepository.findById(
        consultationId).orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN,
        "Not Authorized to cancel this consultation."));

    // Check authorization
    if (Objects.equals(consultation.getPatientId(), userDetails.getId()) ||
        AppUtils.hasRole(userDetails, "DOCTOR")) {

      // Cancel consultation
      consultation.setStatus(EConsultationStatus.canceled);

      // Create some useful information
      String canceledBy = "";

      if (AppUtils.hasRole(userDetails, "DOCTOR")) {
        canceledBy += "Doctor, user ID: " + userDetails.getId().toString();
      } else if (AppUtils.hasRole(userDetails, "PATIENT")) {
        canceledBy += "Patient, user ID:" + userDetails.getId().toString();
      }
      try {
        // Get wallet
        Wallet wallet = walletService.getWalletByPatientId(
            consultation.getPatientId()); // PatientId = UserId !!!

        // If not paid for then Return the balance and skip transactions
        if (Double.parseDouble(consultation.getAmountPaid()) < 1) {
          return wallet.getBalance();
        }

        // Create a transaction.
        Transaction transaction = new Transaction();
        transaction.setText(
            canceledBy + " canceled the consultation: " + consultationId + "\n" +
                consultation.getTransactionUrl());
        transaction.setReference(consultation.getTransactionReference());
        transaction.setType(ETransactionType.DEBIT);
        transaction.setAmount(Double.parseDouble(consultation.getAmountPaid()));
        transaction.setAccount("wallet");

        // Transaction to wallet
        balance = walletService.addTransactionToWallet(wallet, transaction);

        // Remove payout record in db
        boolean ok = payoutService.deletePayOut(consultationId);
        if (ok) {
          log.info("Payout " + consultationId + " deleted.");
        } else {
          log.error("Payout " + consultationId + " could not be deleted.");
          throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
              "Could not delete payout for canceled consultation.");
        }

      } catch (Exception e) {
        log.error("Error canceling consultation: " + e.getMessage());
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
            "Could not cancel consultation.");
      }
    }
    sendCancelConsultationMessages(consultation, userDetails);
    consultationRepository.save(consultation);
    return balance;
  }

  private void sendCancelConsultationMessages(Consultation consultation,
      UserDetailsImpl userDetails) {

    // Collect data for the templates
    Patient patient = patientService.getPatientByUserId(consultation.getPatientId());
    String emailAddress = userService.getUserById(consultation.getPatientId()).getEmail();

    // if patient cancels before a doctorId has been set to the consultation then there's no doctor
    // maybe we should add another template? or modify this one?
    String doctorName = "";
    String clinicName = "";
    if (consultation.getDoctorId() != null) {
      Doctor doctor = doctorService.getByUserId(consultation.getDoctorId());
      doctorName = doctor.getLastName();
      clinicName = providerService.getSpecificprovider(doctor.getProviderId()).getProviderName();
    }

    // Create CancelConsultationByPatient template
    if (AppUtils.hasRole(userDetails, "PATIENT")) {
      TplCanceledConsultationByPatient tpl = new TplCanceledConsultationByPatient();
      tpl.setPatientName(patient.getFirstName() + " " + patient.getSurName());
      tpl.setAppointmentDateTime(consultation.getTimeAccepted());
      tpl.setDoctorName(doctorName);
      tpl.setClinicName(clinicName);
      tpl.setAmount(consultation.getAmountPaid());
      tpl.setLoginLink(LOGIN_URL);

      MessageComposer msgComposer = new MessageComposer(tpl);

      // Send mail to patient
      Mail mail = new Mail(emailAddress, tpl.getSubject());
      emailSenderService.sendComposedEmail(msgComposer.createMessage(CSS.MAIL), mail);

      // Add a Message to message system (Patient-ui inbox)
      MessageDTO.CreateUserSpecificMessage dto = new CreateUserSpecificMessage(
          tpl.getSubject(),
          doctorName,
          msgComposer.createMessage(CSS.PATIENT_UI),
          consultation.getPatientId());
      messageService.createUserSpecificMessage(dto);

    } else {
      // Create CancelConsultationByDoctor template
      TplCanceledConsultationByDoctor tpl = new TplCanceledConsultationByDoctor();
      tpl.setPatientName(patient.getFirstName() + " " + patient.getSurName());
      tpl.setAppointmentDateTime(consultation.getTimeAccepted());
      tpl.setDoctorName(doctorName);
      tpl.setClinicName(clinicName);
      tpl.setAmount(consultation.getAmountPaid());
      tpl.setLoginLink(LOGIN_URL);

      MessageComposer msgComposer = new MessageComposer(tpl);

      // Send mail to patient
      Mail mail = new Mail(emailAddress, tpl.getSubject());
      emailSenderService.sendComposedEmail(msgComposer.createMessage(CSS.MAIL), mail);

      // Add a Message to message system (Patient-ui inbox)
      MessageDTO.CreateUserSpecificMessage dto = new CreateUserSpecificMessage(
          tpl.getSubject(),
          doctorName,
          msgComposer.createMessage(CSS.PATIENT_UI),
          consultation.getPatientId());
      messageService.createUserSpecificMessage(dto);

      // Add a Message to message system (Doctor-ui inbox)
      MessageDTO.CreateUserSpecificMessage dto2 = new CreateUserSpecificMessage(
          tpl.getSubject(),
          consultation.getPatientFullName(),
          msgComposer.createMessage(CSS.DOCTOR_UI),
          consultation.getDoctorId());
      messageService.createUserSpecificMessage(dto2);
    }
  }

  public Consultation save(Consultation consultation) {
    return consultationRepository.save(consultation);
  }

  private Consultation getConsultationByStatus(Long userId, List<EConsultationStatus> status) {
    return consultationRepository.findActiveConsultation(userId, status)
        .orElse(null);
  }


  public List<UnratedConsultation> getUnratedConsultations(Long userId) {
    return consultationRepository.findUnratedConsultation(userId).stream().map(
        consultation -> new UnratedConsultation(consultation.getId(),
            consultation.getTimeFinished(),
            consultation.getDoctorFullName())).collect(Collectors.toList());
  }

  public void abandonPreviousBooking(Long patientId) {
    Consultation consultation = getConsultationByStatus(patientId,
        List.of(EConsultationStatus.booking));

    if (consultation != null) {
      consultation.setStatus(EConsultationStatus.abandoned);
      save(consultation);
    }
  }

  public Consultation getActiveConsultationPatient(Long patientId) {
    return getConsultationByStatus(patientId,
        Arrays.asList(EConsultationStatus.accepted, EConsultationStatus.started,
            EConsultationStatus.booked));
  }

  public Consultation getActiveConsultationDoctor(Long doctorId) {
    return getConsultationByStatus(doctorId,
        Arrays.asList(EConsultationStatus.started, EConsultationStatus.accepted, EConsultationStatus.incomplete));
  }

  public List<Consultation> getFinishedChildConsultations(Long userId, UserDetailsImpl userDetails) {
    Patient parent = patientService.getPatientByUserId(userDetails.getId());
    Patient child = patientService.getPatientByUserId(userId);

    if (!patientService.isChildsParent(child.getUserId(), parent.getUserId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You are not authorized to view this resource.");
    }

    return consultationRepository.findAllByPatientIdAndStatus(userId,
        EConsultationStatus.finished);
  }

  public List<Consultation> getFinishedConsultationsByDoctorId(Long doctorId,
      UserDetailsImpl userDetails) {

    // Enforce doctorId to logged in Doctor
    if (AppUtils.hasRole(userDetails, "DOCTOR")) {
      doctorId = userDetails.getId();
    }

    if (doctorService.isDoctor(doctorId)) {
      Long finalDoctorId = doctorId;
      return new ArrayList<>(new ConsultationSorter(
          consultationRepository.findAll().stream()
              .filter(consultation -> consultation.getStatus().equals(
                  EConsultationStatus.finished)
                  && consultation.getDoctorId().equals(finalDoctorId))
              .collect(Collectors.toList()))
          .getSortedConsultationsByTimeFinished());
    } else {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND,
          "Doctor with the provided id could not be found.");
    }
  }


  public Consultation getConsultationByTransactionReference(String reference) {
    return consultationRepository.findByTransactionReference(reference)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
            "Consultation with the provided transaction reference could not be found."));
  }

  public Optional<Consultation> getByIdAndDoctorId(Long id, Long doctorId) {
    return consultationRepository.findByIdAndDoctorId(id, doctorId);
  }

  public Optional<Consultation> getByIdAndPatientId(Long id, Long patientId) {
    return consultationRepository.findByIdAndPatientId(id, patientId);
  }

  public Optional<Consultation> getById(Long id) {
    return consultationRepository.findById(id);
  }

  public List<Consultation> getAllByPatientIdAndStatusAndIsChildFalse(Long patientId, EConsultationStatus status) {
    return consultationRepository.findAllByPatientIdAndStatusAndIsChild(patientId, status, false);
  }

  public List<Consultation> getAllByChildIdAndStatus(Long childId, EConsultationStatus status) {
    return consultationRepository.findAllByChildIdAndStatus(childId, status);
  }

  public List<Consultation> getAllInChildIdAndStatus(List<Long> childIds, EConsultationStatus status) {
    return consultationRepository.findAllByChildIdInAndStatus(childIds, status);
  }
}