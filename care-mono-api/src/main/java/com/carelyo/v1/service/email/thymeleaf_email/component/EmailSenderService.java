package com.carelyo.v1.service.email.thymeleaf_email.component;

import com.carelyo.v1.service.email.thymeleaf_email.model.Mail;
import com.carelyo.v1.service.template.TemplateService;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.templateresolver.StringTemplateResolver;

@Service
@Log4j2
public class EmailSenderService {


  private final JavaMailSender emailSender;
  private final TemplateService templateService;
  @Value("${spring.mail.from}")
  private String EMAIL_FROM;


  public EmailSenderService(JavaMailSender emailSender, TemplateService templateService) {
    this.emailSender = emailSender;
    this.templateService = templateService;
  }

  public void sendComposedEmail(String composedMessage, Mail mail) {
    MimeMessage message = emailSender.createMimeMessage();
    MimeMessageHelper helper = null;
    try {
      helper = new MimeMessageHelper(message,
          MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
          StandardCharsets.UTF_8.name());
    } catch (MessagingException e) {
      log.error("Failed to email to email address: " + mail.getTo() + "\n" + e.getMessage());
    }

    try {
      assert helper != null;
      helper.setTo(mail.getTo());
      helper.setText(composedMessage, true);
      helper.setSubject(mail.getSubject());
      helper.setFrom(EMAIL_FROM);
      emailSender.send(message);
    } catch (Exception e) {
      log.error("Failed to email to email address: " + mail.getTo() + "\n" + e.getMessage());
    }
  }


  public void sendEmail(Mail mail, String template) throws MessagingException, IOException {
    MimeMessage message = emailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message,
        MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
        StandardCharsets.UTF_8.name());

    SpringTemplateEngine templateEngine = new SpringTemplateEngine();
    StringTemplateResolver stringTemplateResolver = new StringTemplateResolver();
    templateEngine.setTemplateResolver(stringTemplateResolver);

    String templateHtml = templateEngine.process(template, getContext(mail));
    String baseTemplateHtml = templateService.getBaseTemplate().getHtml();
    Context context = new Context();
    context.setVariable("templateHtml", templateHtml);
    String html = templateEngine.process(baseTemplateHtml, context);

    helper.setTo(mail.getTo());
    helper.setText(html, true);
    helper.setSubject(mail.getSubject());
    helper.setFrom(EMAIL_FROM);
    emailSender.send(message);
  }


  public void sendEmailWithAttachment(Mail mail, String template, String attachmentNewName,
      String attachmentFilename)
      throws MessagingException {
    MimeMessage message = emailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message,
        MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
        StandardCharsets.UTF_8.name());

    helper.addAttachment(attachmentNewName,
        new ClassPathResource("/templates/" + attachmentFilename));

    SpringTemplateEngine templateEngine = new SpringTemplateEngine();
    String html = templateEngine.process(template, getContext(mail));
    helper.setTo(mail.getTo());
    helper.setText(html, true);
    helper.setSubject(mail.getSubject());
    helper.setFrom(EMAIL_FROM);

    emailSender.send(message);
  }

  private Context getContext(Mail mail) {
    Context context = new Context();
    mail.getProps().forEach(context::setVariable);
    return context;
  }
}
