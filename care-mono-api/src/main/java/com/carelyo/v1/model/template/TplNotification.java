package com.carelyo.v1.model.template;

import com.carelyo.v1.enums.ETemplateTypes;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

@Setter
@Log4j2
public class TplNotification extends ATemplate {

  final String htmlFile = "notification.html";
  final ETemplateTypes type = ETemplateTypes.NOTIFICATION;

  String loginLink;

  public TplNotification() {

    fetchTemplate(htmlFile);
    super.subject = "Notification template not used";
  }

  @Override
  public void setProps() {
    props.put("login_link", loginLink);
  }

  @Override
  public void updateTemplate() {
    pushTemplate(htmlFile);
  }
}
