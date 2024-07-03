package com.carelyo.v1.model.template;

import com.carelyo.v1.enums.ETemplateTypes;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

@Setter
@Log4j2
public class TplResetPasswordFailed extends ATemplate {

  final String htmlFile = "reset_password_failed.html";
  final ETemplateTypes type = ETemplateTypes.PASSWORD_RESET_FAILED;

  String resetPasswordLink;

  public TplResetPasswordFailed() {
    fetchTemplate(htmlFile);
    super.subject = "Reset password failed";
  }

  @Override
  public void setProps() {
    props.put("reset_password_link", resetPasswordLink);
  }

  @Override
  public void updateTemplate() {
      pushTemplate(htmlFile);
  }

}
