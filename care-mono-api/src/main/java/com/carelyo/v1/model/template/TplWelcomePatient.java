package com.carelyo.v1.model.template;

import com.carelyo.v1.enums.ETemplateTypes;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

@Setter
@Log4j2
public class TplWelcomePatient extends ATemplate {

  final String htmlFile = "welcome_message_patient.html";
  final ETemplateTypes type = ETemplateTypes.WELCOME_MESSAGE_PATIENT;

  String pwd;
  String loginLink;

  public TplWelcomePatient() {
    fetchTemplate(htmlFile);
    super.subject = "Welcome to Carelyo";
  }

  @Override
  public void setProps() {
    props.put("pwd", pwd);
    props.put("login_link", loginLink);
  }

  @Override
  public void updateTemplate() {
    pushTemplate(htmlFile);
  }
}
