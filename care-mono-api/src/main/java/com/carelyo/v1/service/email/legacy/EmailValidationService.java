package com.carelyo.v1.service.email.legacy;

import javax.mail.Authenticator;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

import java.util.Properties;

@SpringBootApplication
@ComponentScan(basePackages = "com.carelyo.v1.service.email.legacy")
public class EmailValidationService {

    public boolean validateEmailCredentials(String username, String password) {
        // Retrieve SMTP server details from environment variables
        String smtpHost = System.getenv("MAIL_HOST");
        String smtpPort = System.getenv("MAIL_PORT");
        String smtpAuth = System.getenv("MAIL_AUTH");
        String smtpStartTls = System.getenv("MAIL_TLS");

        // Set up mail server properties
        Properties properties = new Properties();
        properties.put("mail.smtp.host", smtpHost != null ? smtpHost : "smtp.example.com");
        properties.put("mail.smtp.port", smtpPort != null ? smtpPort : "587");
        properties.put("mail.smtp.auth", smtpAuth != null ? smtpAuth : "true");
        properties.put("mail.smtp.starttls.enable", smtpStartTls != null ? smtpStartTls : "true");

        // Create a session with the mail server
        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            // Attempt to connect and authenticate with the mail server
            session.getTransport().connect();
            // If the connection and authentication succeed, return true
            return true;
        } catch (Exception e) {
            // If an exception occurs during connection or authentication, return false
            return false;
        }
    }
}
