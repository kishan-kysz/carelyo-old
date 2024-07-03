package com.carelyo.v1.model.template;

import com.carelyo.v1.enums.ETemplateTypes;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

@Setter
@Log4j2
public class TplUserInvitation extends ATemplate {

  final String htmlFile = "user_invitation.html";
  final ETemplateTypes type = ETemplateTypes.USER_INVITATION;

  String referallCode;
  String loginLink;
  String registerLink;

  public TplUserInvitation() {
    fetchTemplate(htmlFile);
    super.subject = "Carelyo Invitation";
  }

  @Override
  public void setProps() {
    props.put("referall_code", referallCode);
    props.put("login_link", loginLink);
    props.put("register_link", registerLink);
  }

  @Override
  public void updateTemplate() {
    pushTemplate(htmlFile);
  }

}
