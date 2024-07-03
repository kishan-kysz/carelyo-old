package com.carelyo.v1.controllers.auth;

import com.carelyo.v1.dto.auth.GoogleAuthRequestDTO;
import com.carelyo.v1.dto.auth.LoggedInDTO;
import com.carelyo.v1.dto.auth.LoginDTO;
import com.carelyo.v1.service.auth.LoginService;
import com.carelyo.v1.utils.enums.SSOLoginType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@Tag(name = "Auth", description = "Login and register")

@RequestMapping("/api/v1/auth")
public class LoginController {

  @Autowired
  LoginService loginService;

  @Operation(summary = "Login with email and password or (mobile and password)")
  @PostMapping("/login")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Login successful", content = @Content(mediaType = "application/json", schema = @Schema(implementation = LoggedInDTO.class))),
  })
  public ResponseEntity<LoggedInDTO> authenticateUser(@Valid @RequestBody LoginDTO loginDTO) {
    return ResponseEntity.status(HttpStatus.OK)
        .body(loginService.authenticateUser(loginDTO));
  }

  @Operation(summary = "Login with Google SSO")
  @PostMapping("/sso/{type}/login")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Login successful", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GoogleAuthRequestDTO.class))),
  })
  public ResponseEntity<LoggedInDTO> ssoAuthenticateUser(@PathVariable("type") SSOLoginType type, @Valid @RequestBody GoogleAuthRequestDTO googleAuthRequestDTO) {
    return ResponseEntity.status(HttpStatus.OK)
        .body(loginService.googleAuthenticateUser(googleAuthRequestDTO));
  }
}
