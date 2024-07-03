package com.carelyo.v1.model.template;

import com.carelyo.v1.enums.ETemplateTypes;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

@Setter
@Log4j2
public class TplUserDetailsUpdated extends ATemplate {

  final String htmlFile = "user_details_updated.html";
  final ETemplateTypes type = ETemplateTypes.PROVIDER_UPDATED;

  String loginLink;

  public TplUserDetailsUpdated() {
    fetchTemplate(htmlFile);
    super.subject = "User details";
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
