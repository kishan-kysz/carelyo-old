package com.carelyo.v1.service.consultation;

import com.carelyo.v1.dto.Base64DTO;
import com.carelyo.v1.dto.consultation.ConsultationDTO;
import com.carelyo.v1.dto.consultation.ConsultationDTO.FinishConsultation;
import com.carelyo.v1.dto.consultation.ConsultationDTO.InitializeTransactionRequest;
import com.carelyo.v1.dto.user.MessageDTO;
import com.carelyo.v1.dto.user.MessageDTO.CreateUserSpecificMessage;
import com.carelyo.v1.enums.EConsultationStatus;
import com.carelyo.v1.enums.EDoctorStatus;
import com.carelyo.v1.enums.ESystemStatus;
import com.carelyo.v1.model.consultation.Consultation;
import com.carelyo.v1.model.message.MessageComposer;
import com.carelyo.v1.model.message.MessageComposer.CSS;
import com.carelyo.v1.model.template.TplBookedConsultationByPatient;
import com.carelyo.v1.model.template.TplDoctorAcceptConsultation;
import com.carelyo.v1.model.template.TplDoctorStartedConsultation;
import com.carelyo.v1.model.template.TplFailedPaymentNoBooking;
import com.carelyo.v1.model.template.TplNewConsultationAvailableDoctor;
import com.carelyo.v1.model.user.User;
import com.carelyo.v1.model.user.doctor.Doctor;
import com.carelyo.v1.model.user.patient.Patient;
import com.carelyo.v1.service.consultation.quartz.ScheduledStatusChangeToBooked;
import com.carelyo.v1.service.consultation.quartz.ScheduledStatusChangeToIncomplete;
import com.carelyo.v1.service.doctor.DoctorService;
import com.carelyo.v1.service.email.thymeleaf_email.component.EmailSenderService;
import com.carelyo.v1.service.email.thymeleaf_email.model.Mail;
import com.carelyo.v1.service.external.MinioAdapter;
import com.carelyo.v1.service.external.minio.Base64Ball;
import com.carelyo.v1.service.patient.PatientService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.user.MessageService;
import com.carelyo.v1.service.user.UserService;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import javax.sql.rowset.serial.SerialBlob;
import lombok.extern.log4j.Log4j2;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@Log4j2
public class BookingService {

  private final UserService userService;
  private final DoctorService doctorService;
  private final EmailSenderService emailSenderService;
  private final MessageService messageService;
  private final ScheduledStatusChangeToBooked scheduledStatusChangeToBooked;
  private final ScheduledStatusChangeToIncomplete scheduledStatusChangeToIncomplete;
  private final ConsultationService consultationService;
  private final String NotFoundMessage = "Consultation Does Not Exist";
  private final MinioAdapter minioAdapter;
  @Value("${client.login.url}")
  private String LOGIN_URL;
  private final PatientService patientService;


  //TODO: REFACTOR THIS TO USE THE SERVICES
  public BookingService(
      DoctorService doctorService,
      MessageService messageService,
      ScheduledStatusChangeToBooked scheduledStatusChangeToBooked,
      ScheduledStatusChangeToIncomplete scheduledStatusChangeToIncomplete,
      MinioAdapter minioAdapter,
      UserService userService,
      EmailSenderService emailSenderService,
      ConsultationService consultationService,
      PatientService patientService) {

    this.doctorService = doctorService;
    this.messageService = messageService;
    this.scheduledStatusChangeToBooked = scheduledStatusChangeToBooked;
    this.scheduledStatusChangeToIncomplete = scheduledStatusChangeToIncomplete;
    this.minioAdapter = minioAdapter;
    this.userService = userService;
    this.emailSenderService = emailSenderService;
    this.consultationService = consultationService;
    this.patientService = patientService;
  }

  /**
   * It saves a consultation object to the database
   *
   * @param userId Long
   * @param paystackUrl the transaction url from paystack
   * @param paystackReference the reference returned by paystack after a successful transaction
   * @param request ConsultationDTO.InitializeTransactionRequest
   * @return ConsultationDTO.BookedConsultation
   */
  public Consultation createBooking(String priceListName, Long userId, String paystackUrl,
      String paystackReference,
      ConsultationDTO.InitializeTransactionRequest request, Double duration) {

    Consultation consultation = new Consultation();

    Patient patient = patientService.getPatientByUserId(userId);

    if (!patientService.isProfileComplete(patient.getUserId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "Patient profile is not complete, please complete your profile before booking a consultation");
    }

    /* if the patient has a preferred language, use it, else if the patient has a list of languages,
    use the first language in the list of languages, else use english */
    String language = patient.getLocale().getPreferredLanguage() != null ?
        patient.getLocale().getPreferredLanguage()
        : !patient.getLocale().getLanguages().isEmpty() ?
            patient.getLocale().getLanguages().get(0) : "en";

    String fullName = patient.getFirstName() + " " + patient.getSurName();

    // turn the audio into a blob
    if (request.getAudioDetailedDescription() != null) {
      SerialBlob audioBlob;
      try {
        audioBlob = new SerialBlob(request.getAudioDetailedDescription());
      } catch (SQLException e) {
        throw new RuntimeException(e);
      }
      consultation.setAudioDetailedDescription(audioBlob);
    }

    consultation.setTransactionUrl(paystackUrl);
    consultation.setAmountPaid(request.getAmountPaid().toString());
    consultation.setPriceListName(priceListName);
    consultation.setBodyArea(request.getBodyArea());
    consultation.setTextDetailedDescription(request.getTextDetailedDescription());
    consultation.setTimeBooked(LocalDateTime.now());
    consultation.setStatus(EConsultationStatus.booking);
    consultation.setPatientId(userId);
    consultation.setLanguage(language);
    consultation.setPatientFullName(fullName);
    consultation.setTransactionReference(paystackReference);
    consultation.setDuration(duration);
    consultation.setConsultationType(request.getConsultationType());
    if (request.getChildId() != null && request.getChildId() > 0) {
      consultation.setChildId(request.getChildId());
      consultation.setChild(true);
    } else {
      consultation.setChildId(null);
      consultation.setChild(false);
    }

    consultation = consultationService.save(consultation);
    processImages(consultation, request.getImages());
    return consultation;
  }

  /**
   * It updates a consultation
   *
   * @param id The id of the consultation
   * @param updateConsultation ConsultationDTO.UpdateActiveConsultation
   * @param userId The id of the user who is logged in
   * @return ConsultationDTO.ConsultationResponse
   */
  public Consultation updateBooking(Long id,
      ConsultationDTO.UpdateActiveConsultation updateConsultation, Long userId) {
    Consultation consultation = consultationService.getConsultation(id);
    if (!consultation.getPatientId().equals(userId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You are not authorized to perform this action");
    }
    if (!consultation.getStatus().equals(EConsultationStatus.booked)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "A doctor has been assigned you cannot update this consultation.");
    }
    try {
      if (updateConsultation.getAudioDetailedDescription() != null) {
        consultation.setAudioDetailedDescription(
            new SerialBlob(updateConsultation.getAudioDetailedDescription()));
      }
      if (updateConsultation.getBodyArea() != null) {
        updateConsultation.getBodyArea().forEach(consultation::addBodyArea);
      }
      if (updateConsultation.getTextDetailedDescription() != null) {
        consultation.setTextDetailedDescription(
            updateConsultation.getTextDetailedDescription());
      }
      if (updateConsultation.getLanguage() != null) {
        consultation.setLanguage(updateConsultation.getLanguage());
      }

      consultation = consultationService.save(consultation);

      // Images
      processImages(consultation, updateConsultation.getImages());
      return consultation;

    } catch (SQLException e) {
      e.printStackTrace();
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
          "An error occurred while updating the consultation");
    }
  }

  /**
   * It checks if a consultation exists with the given reference, if it does, it checks if the
   * userId matches the patientId of the consultation, if it does, it sets the timeBooked and status
   * of the consultation and returns the consultation
   *
   * @param reference The transaction reference of the consultation
   * @param userDetails The user details of the user who is logged in
   */
  public Consultation finishBooking(String reference, UserDetailsImpl userDetails) {
    Consultation consultation = consultationService.getConsultationByTransactionReference(
        reference);

    if (!Objects.equals(consultation.getPatientId(), userDetails.getId()) &&
        !patientService.isChildsParent(consultation.getPatientId(), userDetails.getId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You are not authorized to perform this action");
    }
    consultation.setTimeBooked(LocalDateTime.now());
    consultation.setStatus(EConsultationStatus.booked);
    sendToPatientBookingConfirmed(userDetails.getEmail(), userDetails.getId());
    sendToDoctorNewConsultationAvailable();

    return consultationService.save(consultation);
  }

  /**
   * It checks if the user is the doctor, if the consultation exists, if the consultation is booked,
   * then it sets the doctor id, time accepted, status, and then it calls the
   * acceptConsultService.accepted(id, userDetails.getId()); function
   *
   * @param id The id of the consultation
   * @param doctorId The doctor who is accepting the consultation
   * @return A Consultation object
   */

  public Consultation acceptConsultation(Long id, Long doctorId) {
    if (consultationService.getActiveConsultationDoctor(doctorId) != null) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You already have an active consultation");
    }

    Consultation consultation = consultationService.getConsultation(id);

    if (!consultation.getStatus().equals(EConsultationStatus.booked)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "Consultation has already been accepted, has started, is already finished, or is abandoned");
    }

    Doctor doctor = doctorService.getByUserId(doctorId);
    if (doctor.getAccountStatus() != EDoctorStatus.ACTIVE) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Your profile is incomplete");
    }

    consultation.setDoctorId(doctorId);
    consultation.setTimeAccepted(LocalDateTime.now());
    consultation.setStatus(EConsultationStatus.accepted);
    consultation.setDoctorFullName(doctor.getFirstName() + " " + doctor.getLastName());

    consultationService.save(consultation);

    User user = userService.findById(consultation.getPatientId()).orElseThrow(
        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    sendDoctorAcceptConsultationEmail(user.getEmail(), consultation);

    // Start Quartz scheduler
    try {
      scheduledStatusChangeToBooked.startJob(id);
    } catch (SchedulerException e) {
      throw new RuntimeException(e);
    }
    return consultation;
  }

  /**
   * If the consultation exists, stop the consultation, if the user has access to the consultation,
   * if the consultation is accepted, start the consultation
   *
   * @param consultationId Long
   * @param userDetails UserDetailsImpl
   */
  public void startConsultation(Long consultationId, UserDetailsImpl userDetails) {
    if (consultationService.getByIdAndDoctorId(consultationId, userDetails.getId())
        .isEmpty()) { // Doctor is the same as the one who accepted the consultation
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, NotFoundMessage);
    }
    Consultation consultation = consultationService.getByIdAndDoctorId(consultationId,
        userDetails.getId()).get();
    if (!consultation.getStatus().equals(EConsultationStatus.accepted)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "Consultation has not been accepted, has already started, is already finished, or is abandoned");
    }
    consultation.setTimeStarted(LocalDateTime.now());
    consultation.setStatus(EConsultationStatus.started);

    Doctor doctor = doctorService.getByUserId(userDetails.getId());
    doctor.setSystemStatus(ESystemStatus.Busy);

    consultationService.save(consultation);
    doctorService.saveDoctor(doctor);

    User user = userService.findById(consultation.getPatientId()).orElseThrow(
        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    sendDoctorStartedConsultationEmail(user.getEmail(), doctor.getLastName(), user.getId());

    // Start Quartz scheduler to set the status to incomplete after duration
    try {
      scheduledStatusChangeToIncomplete.startJob(consultationId,
          consultation.getDuration().intValue());
    } catch (SchedulerException e) {
      throw new RuntimeException(e);
    }
  }

  /**
   * Complete the consultation and updates the doctor's system status to available
   *
   * @param consultationId Long
   * @param finishConsultationDTO ConsultationDTO.FinishConsultation
   * @param doctorId doctorId
   */
  public Consultation finishConsultation(Long consultationId,
      FinishConsultation finishConsultationDTO, Long doctorId) {

    boolean isValidConsultation = finishConsultationDTO.getSymptoms().size() > 0
        && finishConsultationDTO.getRelatedSymptoms().size() > 0
        && finishConsultationDTO.getSbar().getDiagnosis().length() > 0;
    if (!isValidConsultation) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "Please provide a diagnosis and symptoms");
    }

    if (consultationService.getByIdAndDoctorId(consultationId, doctorId).isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, NotFoundMessage);
    }
    Consultation consultation = consultationService.getByIdAndDoctorId(consultationId,
        doctorId).get();
    boolean validConsultation = consultation.getStatus().equals(EConsultationStatus.started)
        || consultation.getStatus().equals(EConsultationStatus.incomplete);
    if (!validConsultation) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "Consultation has not been accepted, has not started or is already finished");
    }
    consultation.setTimeFinished(LocalDateTime.now());
    consultation.setStatus(EConsultationStatus.finished);
    consultation.setSbar(finishConsultationDTO.getSbar());

    finishConsultationDTO.getSymptoms().forEach(consultation::addSymptom);
    finishConsultationDTO.getRelatedSymptoms().forEach(consultation::addRelatedSymptom);

    doctorService.updateSystemStatus(doctorId, ESystemStatus.Available);
    return consultationService.save(consultation);

  }


  public void rateConsultation(Long consultationId,
      int rating, UserDetailsImpl userDetails) {
    Consultation consultation = consultationService.getConsultation(consultationId);

    if (!Objects.equals(consultation.getPatientId(), userDetails.getId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You are not allowed to rate this consultation");
    }

    if (!consultation.getStatus().equals(EConsultationStatus.finished)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "Consultation is not finished");
    }

    if (consultation.getRating() != null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "You have already rated this consultation");
    }

    consultation.setRating(rating);
    consultationService.save(consultation);
  }

  public void sendDoctorAcceptConsultationEmail(String emailAddress, Consultation consultation) {
    TplDoctorAcceptConsultation tpl = new TplDoctorAcceptConsultation();
    tpl.setDoctorLastName(consultation.getDoctorFullName());
    tpl.setLoginLink(LOGIN_URL);

    MessageComposer msgComposer = new MessageComposer(tpl);

    // Add a mail and send to the patient
    Mail mail = new Mail(emailAddress, tpl.getSubject());
    emailSenderService.sendComposedEmail(msgComposer.createMessage(CSS.MAIL), mail);

    // Add a Message to message system (Patient-ui inbox)
    MessageDTO.CreateUserSpecificMessage dto = new CreateUserSpecificMessage(
        tpl.getSubject(),
        consultation.getDoctorFullName(),
        msgComposer.createMessage(CSS.PATIENT_UI),
        consultation.getPatientId());
    messageService.createUserSpecificMessage(dto);

    // Add message to message system (Doctor-ui inbox)
    MessageDTO.CreateUserSpecificMessage dto2 = new CreateUserSpecificMessage(
        tpl.getSubject(),
        consultation.getPatientFullName(),
        msgComposer.createMessage(CSS.DOCTOR_UI),
        consultation.getDoctorId());
    messageService.createUserSpecificMessage(dto2);
  }

  public void sendDoctorStartedConsultationEmail(String emailAddress, String doctorLastName,
      long userId) {

    TplDoctorStartedConsultation tpl = new TplDoctorStartedConsultation();
    tpl.setDoctorLastName(doctorLastName);
    tpl.setLoginLink(LOGIN_URL);

    MessageComposer msgComposer = new MessageComposer(tpl);

    Mail mail = new Mail(emailAddress, tpl.getSubject());

    emailSenderService.sendComposedEmail(msgComposer.createMessage(CSS.MAIL), mail);

    // Add a Message to message system (Patient-ui inbox)
    MessageDTO.CreateUserSpecificMessage dto = new CreateUserSpecificMessage(
        tpl.getSubject(),
        doctorLastName,
        msgComposer.createMessage(CSS.PATIENT_UI),
        userId);
    messageService.createUserSpecificMessage(dto);
  }

  public void sendToPatientBookingConfirmed(String emailAddress, Long userId) {
    TplBookedConsultationByPatient tpl = new TplBookedConsultationByPatient();
    tpl.setLoginLink(LOGIN_URL);

    MessageComposer msgComposer = new MessageComposer(tpl);

    // Add a mail and send to the patient
    Mail mail = new Mail(emailAddress, tpl.getSubject());
    emailSenderService.sendComposedEmail(msgComposer.createMessage(CSS.MAIL), mail);

    // Send Message to User inbox
    MessageDTO.CreateUserSpecificMessage dto = new CreateUserSpecificMessage(
        tpl.getSubject(),
        "Carelyo",
        msgComposer.createMessage(CSS.PATIENT_UI),
        userId);
    messageService.createUserSpecificMessage(dto);
  }

  public void sendToPatientPaymentFailed(String emailAddress, Long userId) {
    TplFailedPaymentNoBooking tpl = new TplFailedPaymentNoBooking();
    tpl.setLoginLink(LOGIN_URL);

    MessageComposer msgComposer = new MessageComposer(tpl);

    // Add a mail and send to the patient
    Mail mail = new Mail(emailAddress, tpl.getSubject());
    emailSenderService.sendComposedEmail(msgComposer.createMessage(CSS.MAIL), mail);

    // Send Message to User inbox
    MessageDTO.CreateUserSpecificMessage dto = new CreateUserSpecificMessage(
        tpl.getSubject(),
        "Carelyo",
        msgComposer.createMessage(CSS.PATIENT_UI),
        userId);
    messageService.createUserSpecificMessage(dto);
  }

  public void sendToDoctorNewConsultationAvailable() {
    TplNewConsultationAvailableDoctor tpl = new TplNewConsultationAvailableDoctor();
    tpl.setLoginLink(LOGIN_URL);

    List<String> emailList = doctorService.getAllDoctors().stream()
        .map(Doctor::getWorkEmail)
        .filter(Objects::nonNull)
        .collect(Collectors.toList());

    MessageComposer msgComposer = new MessageComposer(tpl);

    // Add a mail and send to all doctors
    for (String email : emailList) {
      Mail mail = new Mail(email, tpl.getSubject());
      emailSenderService.sendComposedEmail(msgComposer.createMessage(CSS.MAIL), mail);
    }
  }

  private void processImages(Consultation consultation, List<Base64DTO> images) {
    if (images != null) {
      // Images
      for (var image : images) {
        Base64Ball ball = new Base64Ball(consultation, image);
        try {
          minioAdapter.uploadObject(ball);
        } catch (Exception e) {
          log.error(e.getMessage());
        }
      }
    }
  }


  public void retainConsultation(Long consultationId, UserDetailsImpl userDetails) {
    Consultation consultation = consultationService.getConsultation(consultationId);

    if (!Objects.equals(consultation.getPatientId(), userDetails.getId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You are not allowed to retain this consultation");
    }
    consultation.setTimeRetained(LocalDateTime.now());
    consultationService.save(consultation);
  }

  public Consultation createChildConsultation(String pricelistName,
      String authorizationUrl, String reference,
      InitializeTransactionRequest initializeTransactionRequestDTO, Double duration,
      Patient child) {
    Consultation consultation = createBooking(pricelistName, child.getUserId(),
        authorizationUrl,
        reference,
        initializeTransactionRequestDTO, duration);
    consultation.setChild(true);

    return consultationService.save(consultation);
  }
}