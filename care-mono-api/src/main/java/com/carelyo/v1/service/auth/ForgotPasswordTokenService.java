package com.carelyo.v1.service.auth;

import com.carelyo.v1.model.user.ForgotPasswordToken;
import com.carelyo.v1.repos.user.ForgotPasswordTokenRepository;
import com.carelyo.v1.service.email.thymeleaf_email.component.EmailSenderService;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;
import java.util.Random;
import java.util.UUID;
import com.carelyo.v1.service.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ForgotPasswordTokenService {

  UserService userService;
  ForgotPasswordTokenRepository forgotPasswordTokenRepository;
  EmailSenderService emailSenderService;

  public ForgotPasswordTokenService(UserService userService,
      ForgotPasswordTokenRepository forgotPasswordTokenRepository,
      EmailSenderService emailSenderService) {
    this.userService = userService;
    this.forgotPasswordTokenRepository = forgotPasswordTokenRepository;
    this.emailSenderService = emailSenderService;
  }

  public ForgotPasswordToken generateForgotPasswordToken(String email) {
    if (userService.existsByEmail(email)) {
      String token = generateToken();
      return new ForgotPasswordToken(token, email);
    }

    throw new ResponseStatusException(HttpStatus.NOT_FOUND,
        "No user was found with the email address: " + email + ".");
  }

  public ForgotPasswordToken findByToken(String token) {
    return forgotPasswordTokenRepository.findByToken(token)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
            "No forgot password token was found with the token: " + token + "."));
  }

  public ForgotPasswordToken findByEmail(String email) {
    return forgotPasswordTokenRepository.findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
            "No forgot password token was found with the email: " + email + "."));
  }

  public ForgotPasswordToken findOrCreateForgotPasswordToken(String email) {
    ForgotPasswordToken forgotPasswordToken = forgotPasswordTokenRepository.findByEmail(email)
        .orElse(null);

    if (forgotPasswordToken == null) {
      forgotPasswordToken = generateForgotPasswordToken(email);
    } else if (forgotPasswordToken.isExpired()) {
      forgotPasswordTokenRepository.delete(forgotPasswordToken);
      forgotPasswordToken = generateForgotPasswordToken(email);
    } else if (forgotPasswordToken.isBlocked()) {
      forgotPasswordTokenRepository.save(forgotPasswordToken);
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You have exceeded the number of attempts to change your password. Please try again later.");
    }

    forgotPasswordToken.incrementTries();
    forgotPasswordTokenRepository.save(forgotPasswordToken);

    return forgotPasswordToken;
  }

  public void save(ForgotPasswordToken forgotPasswordToken) {
    forgotPasswordTokenRepository.save(forgotPasswordToken);
  }

  private String generateToken() {
    Random random = new SecureRandom();
    long randomNumber = random.nextLong();
    long timestamp = new Date().getTime();
    String token = randomNumber + "-" + timestamp;
    UUID uuid = UUID.randomUUID();
    token = token + "-" + uuid;

    return Base64.getEncoder().encodeToString(token.getBytes());
  }
}