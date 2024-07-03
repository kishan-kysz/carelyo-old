package com.carelyo.v1.service.email.thymeleaf_email.model;

import java.util.HashMap;
import java.util.Map;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Mail {

  private String from;
  private String to;
  private String subject;
  private Map<String, String> props;

  public Mail(String from, String to, String subject) {
    this.from = from;
    this.to = to;
    this.subject = subject;
    this.props = new HashMap<>();
  }

  public Mail(String to, String subject) {
    this.to = to;
    this.subject = subject;
  }

  public void setContent(String emailContent) {
  }
}
