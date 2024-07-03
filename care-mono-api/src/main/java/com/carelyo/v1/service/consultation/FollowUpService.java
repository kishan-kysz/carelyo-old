package com.carelyo.v1.service.consultation;

import com.carelyo.v1.dto.summary.FollowUpDTO.NewFollowUpDTO;
import com.carelyo.v1.dto.summary.FollowUpDTO.UpdateFollowUpDTO;
import com.carelyo.v1.dto.user.MessageDTO;
import com.carelyo.v1.dto.user.MessageDTO.CreateUserSpecificMessage;
import com.carelyo.v1.enums.EConsultationStatus;
import com.carelyo.v1.enums.EFollowUpStatus;
import com.carelyo.v1.model.consultation.Consultation;
import com.carelyo.v1.model.message.MessageComposer;
import com.carelyo.v1.model.message.MessageComposer.CSS;
import com.carelyo.v1.model.summary.FollowUp;
import com.carelyo.v1.model.template.TplFollowUpReminder;
import com.carelyo.v1.model.user.patient.Patient;
import com.carelyo.v1.repos.summary.FollowUpRepository;
import com.carelyo.v1.service.consultation.quartz.FollowUpReminderScheduler;
import com.carelyo.v1.service.email.thymeleaf_email.component.EmailSenderService;
import com.carelyo.v1.service.email.thymeleaf_email.model.Mail;
import com.carelyo.v1.service.patient.PatientService;
import com.carelyo.v1.service.pricelist.PriceListService;
import com.carelyo.v1.service.provider.ProviderService;
import com.carelyo.v1.service.user.MessageService;
import com.carelyo.v1.service.user.UserService;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import lombok.extern.log4j.Log4j2;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


@Service
@Log4j2
public class FollowUpService {

  /* @Value(value = "${followup.reminders}")*/
  private static final List<Integer> reminderMinutes = List.of(1440, 30, 15, 0);
  private final FollowUpRepository followUpRepository;
  private final ConsultationService consultationService;
  private final PriceListService priceListService;
  private final UserService userService;
  private final PatientService patientService;
  private final ProviderService providerService;
  private final EmailSenderService emailSenderService;
  private final MessageService messageService;
  private final FollowUpReminderScheduler followUpReminderScheduler;
  @Value("${client.login.url}")
  String LOGIN_URL;

  public FollowUpService(
      FollowUpRepository followUpRepository,
      ConsultationService consultationService,
      PriceListService priceListService,
      UserService userService,
      PatientService patientService,
      ProviderService providerService, EmailSenderService emailSenderService,
      MessageService messageService, FollowUpReminderScheduler followUpReminderScheduler) {

    this.followUpRepository = followUpRepository;
    this.consultationService = consultationService;
    this.priceListService = priceListService;
    this.userService = userService;
    this.patientService = patientService;
    this.providerService = providerService;
    this.emailSenderService = emailSenderService;
    this.messageService = messageService;
    this.followUpReminderScheduler = followUpReminderScheduler;
  }

  public List<FollowUp> getAllFollowUp() {
    return followUpRepository.findAll();
  }

  public FollowUp createFollowUp(NewFollowUpDTO followUpFormDTO) {
    Consultation consultation = consultationService.getConsultation(
        followUpFormDTO.getConsultationId());

    // Followup record is created by doctor in a started consultation
    if (consultation.getStatus() != EConsultationStatus.started) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "Follow up cannot be created for consultation that's not started");
    }

    FollowUp followUp = new FollowUp(followUpFormDTO);

    // Set the price
    if (consultation.getAmountPaid() != null) {
      double price = priceListService.getPriceById("followup");
      followUp.setPrice(price);
    }

    LocalDateTime oneHourFromNow = LocalDateTime.now().plusHours(1);

    if (followUp.getFollowUpDate().isBefore(oneHourFromNow)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "Follow-up cannot be created. Schedule time should be at least one hour from now.");
    }



    // This works with the userId
    followUp.setPatientId(consultation.getPatientId());
    followUp.setConsultationId(consultation.getId());
    followUp.setStatus(EFollowUpStatus.INACTIVE.getTextVal());
    followUp.setDoctorId(consultation.getDoctorId());
    FollowUp savedFollowUp = followUpRepository.save(followUp);

    // Update the consultation
    consultation.setFollowUp(savedFollowUp);
    consultationService.save(consultation);

    // Collect information and send a message
    Patient patient = patientService.getPatientByUserId(consultation.getPatientId());
    sendFollowUpMessage(followUp.getFollowUpDate(), patient);

    // **************** Creating Reminder Jobs *************************


    boolean firstReminder;
    boolean lastReminder = false;

    // Create Quartz jobs for reminders.
    // This calculates to set the reminders as followupDate - reminder minutes
    for (int time : reminderMinutes) {

      // calculate when to trigger
      LocalDateTime followupDate = followUp.getFollowUpDate();
      LocalDateTime dateNow = LocalDateTime.now();

      // get the minutes to followup reminder
      long whenToTrigger = dateNow.until(followupDate, ChronoUnit.MINUTES) - time;

      int index = reminderMinutes.indexOf(time);

      // First scheduled reminder
      firstReminder = index == 0;

      // Last scheduled reminder
      if (index == reminderMinutes.size() - 1) {
        // Make sure time to trigger not negative (unlucky) and change the reminderDetails
        if (whenToTrigger <= 0) {
          whenToTrigger = 0;
        }
        lastReminder = true;
      }

      // Start Quartz scheduler
      try {
        followUpReminderScheduler.startJob(followUp.getId(), whenToTrigger,
            firstReminder, lastReminder);
      } catch (SchedulerException e) {
        log.error("Error while scheduling followup reminder job : {}", e.getMessage());
      }
    }
    return followUp;
  }

  private void sendFollowUpMessage(LocalDateTime followUpDateTime, Patient patient) {
    String providerName = patient.getProviderId() == null ? providerService.getDefaultProvider().getProviderName()
        : providerService.getSpecificprovider(patient.getProviderId())
            .getProviderName();
    String mailAddress = userService.getUserById(patient.getUserId()).getEmail();

    // Set the template
    TplFollowUpReminder tpl = new TplFollowUpReminder();
    tpl.setPatientTitle(patient.getTitle());
    tpl.setPatientName(patient.getSurName());
    tpl.setFollowupDateTime(followUpDateTime);
    tpl.setClinicName(providerName);
    tpl.setYourName("Your Name");
    tpl.setLoginLink(LOGIN_URL);

    // Compose the message
    MessageComposer msgComposer = new MessageComposer(tpl);

    // Add a Message to message system
    MessageDTO.CreateUserSpecificMessage dto = new CreateUserSpecificMessage(
        tpl.getSubject(),
        "Carelyo",
        msgComposer.createMessage(CSS.PATIENT_UI),
        patient.getUserId());
    messageService.createUserSpecificMessage(dto);

    // Send a Mail
    Mail mail = new Mail(mailAddress, "Follow up reminder");
    emailSenderService.sendComposedEmail(msgComposer.createMessage(CSS.MAIL), mail);
  }

  public void followUpReminder(Long followUpId, Boolean firstReminder,
      Boolean lastReminder) {

    // Get extern variables
    FollowUp followUp = followUpRepository.getOne(followUpId);
    Consultation consultation = consultationService.getConsultation(followUp.getConsultationId());
    Patient patient = patientService.getPatientByUserId(consultation.getPatientId());

    // Tasks to be done on first scheduled reminder
    if (firstReminder) {
      followUp.setStatus(EFollowUpStatus.ACTIVE.getTextVal());
      followUpRepository.save(followUp);
    }

    // Tasks to be done on last scheduled reminder
    if (lastReminder) {
      followUp.setStatus(EFollowUpStatus.EXPIRED.getTextVal());
      followUpRepository.save(followUp);
    }

    // Send email
    sendFollowUpMessage(followUp.getFollowUpDate(), patient);
  }


  public FollowUp updateFollowUp(UpdateFollowUpDTO followUpDTO) {
    FollowUp followUp = getFollowUpById(followUpDTO.getId());
    if (followUp == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND,
          "Follow Up with the provided id could not be found or does not exist");
    }
    followUp.setFollowUpDate(followUpDTO.getFollowUpDate());
    followUp.setLocation(followUpDTO.getLocation());
    followUp.setPurpose(followUpDTO.getPurpose());
    followUpRepository.save(followUp);
    return followUp;
  }

  public FollowUp getFollowUpById(Long id) {
    return followUpRepository.findById(id)
        .orElse(null);
  }

  Optional<FollowUp> getByConsultationId(Long consultationId) {
    return followUpRepository.findByConsultationId(consultationId);
  }

  // Origin consultation
  public FollowUp getFollowUpByConsultationIdAndPatientId(Long consultationId, Long patientId) {
    return followUpRepository.findByConsultationIdAndPatientId(consultationId, patientId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
            "Follow Up with the provided id could not be found or does not exist"));

  }

  public void deleteFollowUp(Long id, Long doctorId) {
    FollowUp followUp = followUpRepository.findByIdAndDoctorId(id, doctorId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
            "Follow Up with the provided id could not be found or does not exist"));
    consultationService.removeFollowUp(followUp.getConsultationId());
    followUpRepository.delete(followUp);
  }
}
