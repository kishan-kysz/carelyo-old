package com.carelyo.v1.service.email.legacy;

public interface EmailService {

  void sendEmail(String from, String to, String title, String body);
}
