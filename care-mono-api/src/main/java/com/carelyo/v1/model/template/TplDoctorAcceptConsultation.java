package com.carelyo.v1.model.template;

import com.carelyo.v1.enums.ETemplateTypes;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

@Setter
@Log4j2
public class TplDoctorAcceptConsultation extends ATemplate {

  final String htmlFile = "doctor_accept_consultation.html";
  final ETemplateTypes type = ETemplateTypes.DOCTOR_ACCEPT_CONSULTATION;

  String doctorLastName;
  String loginLink;

  public TplDoctorAcceptConsultation() {
    fetchTemplate(htmlFile);
    super.subject = "Doctor has accepted your consultation";
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
