package com.carelyo.v1.service.template;

import com.carelyo.v1.dto.template.TemplateDTO;
import com.carelyo.v1.enums.ETemplateTypes;
import com.carelyo.v1.model.template.Template;
import com.carelyo.v1.model.template.TplBase;
import com.carelyo.v1.model.template.TplBookedConsultationByPatient;
import com.carelyo.v1.model.template.TplCanceledConsultationByDoctor;
import com.carelyo.v1.model.template.TplCanceledConsultationByPatient;
import com.carelyo.v1.model.template.TplDoctorAcceptConsultation;
import com.carelyo.v1.model.template.TplDoctorStartedConsultation;
import com.carelyo.v1.model.template.TplFailedPaymentNoBooking;
import com.carelyo.v1.model.template.TplFollowUpBooked;
import com.carelyo.v1.model.template.TplFollowUpReminder;
import com.carelyo.v1.model.template.TplNewConsultationAvailableDoctor;
import com.carelyo.v1.model.template.TplNotification;
import com.carelyo.v1.model.template.TplProviderUpdated;
import com.carelyo.v1.model.template.TplResetPassword;
import com.carelyo.v1.model.template.TplResetPasswordFailed;
import com.carelyo.v1.model.template.TplUserDetailsUpdated;
import com.carelyo.v1.model.template.TplUserInvitation;
import com.carelyo.v1.model.template.TplWelcomeDoctor;
import com.carelyo.v1.model.template.TplWelcomePatient;
import com.carelyo.v1.repos.template.TemplateRepository;
import java.util.ArrayList;
import java.util.List;
// import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
// @Log4j2

public class TemplateService {

  private final TemplateRepository templateRepository;

  public TemplateService(TemplateRepository templateRepository) {
    this.templateRepository = templateRepository;
  }

  public Template getBaseTemplate() {
    return templateRepository.findByTemplateType(ETemplateTypes.BASE_TEMPLATE)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
            "TplBase template could not be found"));
  }



  public Template getTemplate(ETemplateTypes type) {
    Template template = new Template();
    switch (type) {
      case BASE_TEMPLATE:
        TplBase tplBase = new TplBase();
        template.setHtml(tplBase.getTemplate());
        template.setSubject(tplBase.getSubject());
        break;
      case CANCEL_CONSULTATION_DOCTOR:
        TplCanceledConsultationByDoctor tplCanceledConsultationByDoctor = new TplCanceledConsultationByDoctor();
        template.setHtml(tplCanceledConsultationByDoctor.getTemplate());
        template.setSubject(tplCanceledConsultationByDoctor.getSubject());
        break;
      case CANCEL_CONSULTATION_PATIENT:
        TplCanceledConsultationByPatient tplCanceledConsultationByPatient = new TplCanceledConsultationByPatient();
        template.setHtml(tplCanceledConsultationByPatient.getTemplate());
        template.setSubject(tplCanceledConsultationByPatient.getSubject());
        break;
      case DOCTOR_ACCEPT_CONSULTATION:
        TplDoctorAcceptConsultation tplDoctorAcceptConsultation = new TplDoctorAcceptConsultation();
        template.setHtml(tplDoctorAcceptConsultation.getTemplate());
        template.setSubject(tplDoctorAcceptConsultation.getSubject());
        break;
      case DOCTOR_STARTED_CONSULTATION:
        TplDoctorStartedConsultation tplDoctorStartedConsultation = new TplDoctorStartedConsultation();
        template.setHtml(tplDoctorStartedConsultation.getTemplate());
        template.setSubject(tplDoctorStartedConsultation.getSubject());
        break;
      case FOLLOWUP_REMINDER:
        TplFollowUpReminder tplFollowUpReminder = new TplFollowUpReminder();
        template.setHtml(tplFollowUpReminder.getTemplate());
        template.setSubject(tplFollowUpReminder.getSubject());
        break;
      case NOTIFICATION:
        TplNotification tplNotification = new TplNotification();
        template.setHtml(tplNotification.getTemplate());
        template.setSubject(tplNotification.getSubject());
        break;
      case PASSWORD_RESET:
        TplResetPassword tplResetPassword = new TplResetPassword();
        template.setHtml(tplResetPassword.getTemplate());
        template.setSubject(tplResetPassword.getSubject());
        break;
      case USER_INVITATION:
        TplUserInvitation tplUserInvitation = new TplUserInvitation();
        template.setHtml(tplUserInvitation.getTemplate());
        template.setSubject(tplUserInvitation.getSubject());
        break;
      case WELCOME_MESSAGE_DOCTOR:
        TplWelcomeDoctor tplWelcomeDoctor = new TplWelcomeDoctor();
        template.setHtml(tplWelcomeDoctor.getTemplate());
        template.setSubject(tplWelcomeDoctor.getSubject());
        break;
      case WELCOME_MESSAGE_PATIENT:
        TplWelcomePatient tplWelcomePatient = new TplWelcomePatient();
        template.setHtml(tplWelcomePatient.getTemplate());
        template.setSubject(tplWelcomePatient.getSubject());
        break;
      case BOOKED_CONSULTATION_PATIENT:
        TplBookedConsultationByPatient tpl = new TplBookedConsultationByPatient();
        template.setHtml(tpl.getTemplate());
        template.setSubject(tpl.getSubject());
        break;
      case NEW_CONSULTATION_AVAILABLE_DOCTOR:
        TplNewConsultationAvailableDoctor tplNewConsultationAvailableDoctor = new TplNewConsultationAvailableDoctor();
        template.setHtml(tplNewConsultationAvailableDoctor.getTemplate());
        template.setSubject(tplNewConsultationAvailableDoctor.getSubject());
        break;
      case FAILED_PAYMENT_NO_BOOKING:
        TplFailedPaymentNoBooking tplFailedPaymentNoBooking = new TplFailedPaymentNoBooking();
        template.setHtml(tplFailedPaymentNoBooking.getTemplate());
        template.setSubject(tplFailedPaymentNoBooking.getSubject());
        break;
      case FOLLOWUP_BOOKED:
        TplFollowUpBooked tplFollowUpBooked = new TplFollowUpBooked();
        template.setHtml(tplFollowUpBooked.getTemplate());
        template.setSubject(tplFollowUpBooked.getSubject());
        break;
      case PASSWORD_RESET_FAILED:
        TplResetPasswordFailed tplResetPasswordFailed = new TplResetPasswordFailed();
        template.setHtml(tplResetPasswordFailed.getTemplate());
        template.setSubject(tplResetPasswordFailed.getSubject());
        break;
      case PROVIDER_UPDATED:
        TplProviderUpdated tplProviderUpdated = new TplProviderUpdated();
        template.setHtml(tplProviderUpdated.getTemplate());
        template.setSubject(tplProviderUpdated.getSubject());
        break;
      case USER_DETAILS_UPDATED:
        TplUserDetailsUpdated tplUserDetailsUpdated = new TplUserDetailsUpdated();
        template.setHtml(tplUserDetailsUpdated.getTemplate());
        template.setSubject(tplUserDetailsUpdated.getSubject());
        break;


    }
    template.setTemplateType(type);
    template.setSender("Carelyo");
    return template;
  }

  public void updateTemplate(ETemplateTypes type, TemplateDTO.Update templateDTO) {

    switch (type) {
      case BASE_TEMPLATE:
        TplBase tplBase = new TplBase();
        tplBase.setTemplate(templateDTO.getHtml());
        tplBase.updateTemplate();
        break;
      case CANCEL_CONSULTATION_DOCTOR:
        TplCanceledConsultationByDoctor tplCanceledConsultationByDoctor = new TplCanceledConsultationByDoctor();
        tplCanceledConsultationByDoctor.setTemplate(templateDTO.getHtml());
        tplCanceledConsultationByDoctor.updateTemplate();
        break;
      case CANCEL_CONSULTATION_PATIENT:
        TplCanceledConsultationByPatient tplCanceledConsultationByPatient = new TplCanceledConsultationByPatient();
        tplCanceledConsultationByPatient.setTemplate(templateDTO.getHtml());
        tplCanceledConsultationByPatient.updateTemplate();
        break;
      case DOCTOR_ACCEPT_CONSULTATION:
        TplDoctorAcceptConsultation tplDoctorAcceptConsultation = new TplDoctorAcceptConsultation();
        tplDoctorAcceptConsultation.setTemplate(templateDTO.getHtml());
        tplDoctorAcceptConsultation.updateTemplate();
        break;
      case DOCTOR_STARTED_CONSULTATION:
        TplDoctorStartedConsultation tplDoctorStartedConsultation = new TplDoctorStartedConsultation();
        tplDoctorStartedConsultation.setTemplate(templateDTO.getHtml());
        tplDoctorStartedConsultation.updateTemplate();
        break;
      case FOLLOWUP_REMINDER:
        TplFollowUpReminder tplFollowUpReminder = new TplFollowUpReminder();
        tplFollowUpReminder.setTemplate(templateDTO.getHtml());
        tplFollowUpReminder.updateTemplate();
        break;
      case NOTIFICATION:
        TplNotification tplNotification = new TplNotification();
        tplNotification.setTemplate(templateDTO.getHtml());
        tplNotification.updateTemplate();
        break;
      case PASSWORD_RESET:
        TplResetPassword tplResetPassword = new TplResetPassword();
        tplResetPassword.setTemplate(templateDTO.getHtml());
        tplResetPassword.updateTemplate();
        break;
      case USER_INVITATION:
        TplUserInvitation tplUserInvitation = new TplUserInvitation();
        tplUserInvitation.setTemplate(templateDTO.getHtml());
        tplUserInvitation.updateTemplate();
        break;
      case WELCOME_MESSAGE_DOCTOR:
        TplWelcomeDoctor tplWelcomeDoctor = new TplWelcomeDoctor();
        tplWelcomeDoctor.setTemplate(templateDTO.getHtml());
        tplWelcomeDoctor.updateTemplate();
        break;
      case WELCOME_MESSAGE_PATIENT:
        TplWelcomePatient tplWelcomePatient = new TplWelcomePatient();
        tplWelcomePatient.setTemplate(templateDTO.getHtml());
        tplWelcomePatient.updateTemplate();
        break;
    }
  }

  public List<Template> getAllTemplates() {
    List<Template> templates = new ArrayList<>();
    long n = 0;
    for (ETemplateTypes type : ETemplateTypes.values()) {
      n += 1;
      Template template = getTemplate(type);
      template.setId(n);
      templates.add(template);
    }
    return templates;
  }
}

