package com.carelyo.v1.model.template;

import com.carelyo.v1.enums.ETemplateTypes;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Setter
public class TplBase extends ATemplate {

  final String htmlFile = "base_template.html";
  final ETemplateTypes type = ETemplateTypes.BASE_TEMPLATE;

  String templateHtml;

  public TplBase() {
    fetchTemplate(htmlFile);
  }

  @Override
  public void setProps() {
    props.put("template_html", templateHtml);
  }

  @Override
  public void updateTemplate() {
    pushTemplate(htmlFile);
  }
}
