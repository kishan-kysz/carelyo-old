package com.carelyo.v1.service.auth;

import com.carelyo.v1.dto.auth.NewPasswordDTO;
import com.carelyo.v1.dto.auth.ResetPasswordDTO;
import com.carelyo.v1.model.message.MessageComposer;
import com.carelyo.v1.model.message.MessageComposer.CSS;
import com.carelyo.v1.model.provider.Provider;
import com.carelyo.v1.model.template.TplResetPassword;
import com.carelyo.v1.model.user.ForgotPasswordToken;
import com.carelyo.v1.model.user.User;
import com.carelyo.v1.model.user.patient.Patient;
import com.carelyo.v1.service.email.thymeleaf_email.component.EmailSenderService;
import com.carelyo.v1.service.email.thymeleaf_email.model.Mail;
import com.carelyo.v1.service.patient.PatientService;
import com.carelyo.v1.service.provider.ProviderService;
import com.carelyo.v1.service.user.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ForgotPasswordService {

  private final PasswordEncoder passwordEncoder;
  private final ForgotPasswordTokenService forgotPasswordTokenService;
  private final EmailSenderService emailSenderService;
  private final UserService userService;
  private final PatientService patientService;
  private final ProviderService providerService;

  @Value("${client.login.url}")
  private String LOGIN_URL;

  public ForgotPasswordService(PasswordEncoder passwordEncoder,
      ForgotPasswordTokenService forgotPasswordTokenService,
      EmailSenderService emailSenderService, UserService userService,
      PatientService patientService, ProviderService providerService) {
    this.passwordEncoder = passwordEncoder;
    this.forgotPasswordTokenService = forgotPasswordTokenService;
    this.emailSenderService = emailSenderService;
    this.userService = userService;
    this.patientService = patientService;
    this.providerService = providerService;
  }

  public void forgotPassword(ResetPasswordDTO resetPasswordDTO) {
    User user = userService.findByEmail(resetPasswordDTO.getEmail());

    ForgotPasswordToken forgotPasswordToken = forgotPasswordTokenService.findOrCreateForgotPasswordToken(
        user.getEmail());
    forgotPasswordTokenService.save(forgotPasswordToken);

    sendResetPasswordEmail(user.getEmail(), forgotPasswordToken.getToken());
  }

  public void newPassword(NewPasswordDTO newPasswordDTO) {
    ForgotPasswordToken forgotPasswordToken = forgotPasswordTokenService.findByToken(
        newPasswordDTO.getToken());

    User user = null;
    if(userService.existsByEmail(newPasswordDTO.getEmail())) {
      user = userService.findByEmail(newPasswordDTO.getEmail());
    }

    if (forgotPasswordToken.isExpired()) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Token has expired");
    } else if (forgotPasswordToken.isBlocked()) {
      forgotPasswordTokenService.save(forgotPasswordToken);
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Too many attempts");
    }

    if (user == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND,
          "User with the provided email does not exist");
    } else if (!forgotPasswordToken.getEmail().equals(user.getEmail())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "Email does not match with token");
    }

    /*  forgotPasswordToken.incrementTries();*/
    forgotPasswordTokenService.save(forgotPasswordToken);

    user.setPassword(passwordEncoder.encode(newPasswordDTO.getPassword()));
    userService.save(user);
  }

  private void sendResetPasswordEmail(String email, String token) {

    User user = userService.findByEmail(email);
    Patient patient = patientService.getPatientByUserId(user.getId());
    Provider provider = providerService.getSpecificprovider(patient.getProviderId());

    TplResetPassword tpl = new TplResetPassword();
    tpl.setResetPasswordLink(LOGIN_URL + "/reset-password?k=" + token);
    tpl.setProviderName(provider.getProviderName());

    MessageComposer msgComposer = new MessageComposer(tpl);

    Mail mail = new Mail(email, tpl.getSubject());

    emailSenderService.sendComposedEmail(msgComposer.createMessage(CSS.MAIL), mail);
  }
}