package com.carelyo.v1.model.template;

import com.carelyo.v1.enums.ETemplateTypes;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

@Setter
@Log4j2
public class TplDoctorStartedConsultation extends ATemplate {

  final String htmlFile = "doctor_started_consultation.html";
  final ETemplateTypes type = ETemplateTypes.DOCTOR_STARTED_CONSULTATION;

  String doctorLastName;
  String loginLink;

  public TplDoctorStartedConsultation() {
    fetchTemplate(htmlFile);
    super.subject = "Doctor has started your consultation";
  }

  public String getSubject() {
    return this.subject;
  }

  @Override
  public void setProps() {
    props.put("doctor_last_name", doctorLastName);
    props.put("login_link", loginLink);
  }

  @Override
  public void updateTemplate() {
    pushTemplate(htmlFile);
  }
}
