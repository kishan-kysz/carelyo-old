package com.carelyo.v1.service.email.legacy;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

// @Service
// public class EmailServiceImpl implements EmailService {

//   private final JavaMailSender javaMailSender;

//   @Autowired
//   public EmailServiceImpl(JavaMailSender javaMailSender) {
//     this.javaMailSender = javaMailSender;
//   }

//   @Override
//   public void sendEmail(String from, String to, String title, String body) {
//     MimeMessage message = this.javaMailSender.createMimeMessage();
//     MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(message);
//     try {
//       if (from != null) {
//         mimeMessageHelper.setFrom(from);
//       }
//       mimeMessageHelper.setSubject(title);
//       mimeMessageHelper.setText(body);
//       mimeMessageHelper.setTo(to);
//       this.javaMailSender.send(message);
//     } catch (MessagingException messageException) {
//       throw new RuntimeException(messageException);
//     }
//   }
// }


import org.springframework.mail.javamail.JavaMailSenderImpl;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;

    private final EmailValidationService emailValidationService;

    public EmailServiceImpl(JavaMailSender javaMailSender, EmailValidationService emailValidationService) {
        this.javaMailSender = javaMailSender;
        this.emailValidationService = emailValidationService;
    }

    @Override
    public void sendEmail(String from, String to, String title, String body) {
        MimeMessage message = this.javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(message);
        try {
            if (from != null) {
                mimeMessageHelper.setFrom(from);
            }
            mimeMessageHelper.setSubject(title);
            mimeMessageHelper.setText(body);
            mimeMessageHelper.setTo(to);

            // Validate email credentials before sending
            if (emailValidationService.validateEmailCredentials(((JavaMailSenderImpl) javaMailSender).getUsername(),
                    ((JavaMailSenderImpl) javaMailSender).getPassword())) {
                this.javaMailSender.send(message);
            } else {
                // Handle authentication failure, you may throw an exception or log a warning
                throw new RuntimeException("Email authentication failed");
            }
        } catch (MessagingException messageException) {
            throw new RuntimeException(messageException);
        }
    }
}
