package com.carelyo.v1.model.template;

import com.carelyo.v1.enums.ETemplateTypes;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

@Setter
@Log4j2
public class TplWelcomeDoctor extends ATemplate {

  final String htmlFile = "welcome_message_doctor.html";
  final ETemplateTypes type = ETemplateTypes.WELCOME_MESSAGE_DOCTOR;

  String doctorLastName;
  String pwd;
  String loginLink;

  public TplWelcomeDoctor() {
    fetchTemplate(htmlFile);
    super.subject = "Welcome to Carelyo";
  }

  @Override
  public void setProps() {
    props.put("doctor_last_name", doctorLastName);
    props.put("pwd", pwd);
    props.put("login_link", loginLink);
  }

  @Override
  public void updateTemplate() {
    pushTemplate(htmlFile);
  }

}
