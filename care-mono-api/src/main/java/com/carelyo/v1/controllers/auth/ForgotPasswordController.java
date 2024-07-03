package com.carelyo.v1.controllers.auth;

import com.carelyo.v1.dto.auth.NewPasswordDTO;
import com.carelyo.v1.dto.auth.ResetPasswordDTO;
import com.carelyo.v1.service.auth.ForgotPasswordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;


@RestController
@Tag(name = "Auth", description = "Login and register")
@RequestMapping("/api/v1/auth/")
public class ForgotPasswordController {

  private final ForgotPasswordService forgotPasswordService;

  ForgotPasswordController(ForgotPasswordService forgotPasswordService) {
    this.forgotPasswordService = forgotPasswordService;
  }

  @Operation(summary = "Send reset password email")
  @PostMapping("/forgot-password")
  public ResponseEntity<String> forgotPassword(
      @Valid @RequestBody ResetPasswordDTO resetPasswordDTO) {
    // returns OK even if email doesn't exist so that hackers can't find out if an
    // email is registered or not
    try {

      forgotPasswordService.forgotPassword(resetPasswordDTO);
      return ResponseEntity.ok().body("Success");
    } catch (ResponseStatusException e) {
      return ResponseEntity.badRequest()
          .body("Can not reset password right now. Try again later" + e.getMessage());
    }
  }

  @Operation(summary = "Reset password")
  @PostMapping("/reset-password")
  public ResponseEntity<String> newPassword(@Valid @RequestBody NewPasswordDTO newPasswordDTO) {
    forgotPasswordService.newPassword(newPasswordDTO);
    return ResponseEntity.ok().body("Password has been changed");
  }
}