package com.carelyo.v1.service.email.thymeleaf_email;

import com.carelyo.v1.service.email.thymeleaf_email.component.EmailSenderService;
import com.carelyo.v1.service.email.thymeleaf_email.model.Mail;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class OtpEmailComponent {

  private static final Logger logger = LoggerFactory.getLogger(OtpEmailComponent.class);
  private final EmailSenderService emailService;


  public OtpEmailComponent(EmailSenderService emailService) {
    this.emailService = emailService;
  }

  public void send(String to, String subject, String code) throws Exception {
    logger.info("START... Sending OTP email");
    Mail mail = new Mail();
    mail.setTo(to);
    mail.setSubject(subject);
    Map<String, String> props = new HashMap<>();
    props.put("code", code);
    props.put("signature", "Carelyo Support");
    props.put("location", "Lagos, Nigeria");
    mail.setProps(props);
    emailService.sendEmail(mail, "otp-email-template");
    logger.info("END..." + code + " OTP email sent success");
  }
}
