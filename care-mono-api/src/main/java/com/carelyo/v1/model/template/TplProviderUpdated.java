package com.carelyo.v1.model.template;

import com.carelyo.v1.enums.ETemplateTypes;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

@Setter
@Log4j2
public class TplProviderUpdated extends ATemplate {

  final String htmlFile = "provider_updated.html";
  final ETemplateTypes type = ETemplateTypes.PROVIDER_UPDATED;

  String title;
  String doctorLastName;
  String loginLink;

  public TplProviderUpdated() {
    fetchTemplate(htmlFile);
    super.subject = "Provider updated";
  }

  @Override
  public void setProps() {
    props.put("title", title);
    props.put("doctor_last_name", doctorLastName);
    props.put("login_link", loginLink);
  }

  @Override
  public void updateTemplate() {
    pushTemplate(htmlFile);
  }
}
