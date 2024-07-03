package com.carelyo.v1.model.template;

import com.carelyo.v1.enums.ETemplateTypes;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

@Setter
@Log4j2
public class TplResetPassword extends ATemplate {

  final String htmlFile = "reset_password.html";
  final ETemplateTypes type = ETemplateTypes.PASSWORD_RESET;

  String resetPasswordLink;
  String providerName;

  public TplResetPassword() {
    fetchTemplate(htmlFile);
    super.subject = "Password reset";
  }

  @Override
  public void setProps() {
    props.put("reset_password_link", resetPasswordLink);
    props.put("provider_name", providerName);
  }

  @Override
  public void updateTemplate() {
      pushTemplate(htmlFile);
  }

}
