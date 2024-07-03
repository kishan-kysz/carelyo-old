package com.carelyo.v1.model.template;

import com.carelyo.v1.dto.template.TemplateDTO;
import com.carelyo.v1.enums.ETemplateTypes;
import com.carelyo.v1.model.BaseModel;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Template extends BaseModel {

  @Column(length = 5000)
  private String html;
  @Enumerated(EnumType.STRING)
  private ETemplateTypes templateType;
  private String subject;
  private String sender;

  public Template(String html, ETemplateTypes templateType) {
    this.html = html;
    this.templateType = templateType;
  }

  public Template(String html, ETemplateTypes templateType, String subject, String sender) {
    this.html = html;
    this.templateType = templateType;
    this.subject = subject;
    this.sender = sender;
  }

  public TemplateDTO.Response getResponseDTO() {
    return new TemplateDTO.Response(
        this.getId(),
        this.html,
        this.templateType.toString(),
        this.subject,
        this.sender,
        this.getCreatedAt(),
        this.getUpdatedAt()
    );
  }

}
