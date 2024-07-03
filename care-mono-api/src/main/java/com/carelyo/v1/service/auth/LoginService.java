package com.carelyo.v1.service.auth;

import com.carelyo.v1.dto.auth.GoogleAuthRequestDTO;
import com.carelyo.v1.dto.auth.GoogleAuthResponseDTO;
import com.carelyo.v1.dto.auth.LoggedInDTO;
import com.carelyo.v1.dto.auth.LoginDTO;
import com.carelyo.v1.dto.auth.SignupDTO;
import com.carelyo.v1.dto.auth.SignupDTO.PatientSignupDTO;
import com.carelyo.v1.enums.ESystemStatus;
import com.carelyo.v1.model.user.SystemAdmin;
import com.carelyo.v1.model.user.User;
import com.carelyo.v1.model.user.doctor.Doctor;
import com.carelyo.v1.model.user.patient.Patient;
import com.carelyo.v1.service.doctor.DoctorService;
import com.carelyo.v1.service.patient.PatientService;
import com.carelyo.v1.service.security.jwt.JwtUtils;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import java.util.List;
import java.util.stream.Collectors;
import com.carelyo.v1.service.user.UserService;
import io.netty.util.internal.ThreadLocalRandom;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import com.carelyo.v1.service.user.SystemAdminService;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class LoginService {

  private final AuthenticationManager authenticationManager;
  private final SystemAdminService systemAdminService;
  private final RegistrationService registrationService;
  private final UserService userService;

  private final PatientService patientService;
  private final JwtUtils jwtUtils;
  private final DoctorService doctorService;
  private final Logger logger = LoggerFactory.getLogger(LoginService.class);

  @Value("${google.userInfo.url}")
  private String GOOGLE_USERINFO_URL;

  public LoginService(AuthenticationManager authenticationManager,
      SystemAdminService systemAdminService, RegistrationService registrationService,
      UserService userService,
      PatientService patientService, JwtUtils jwtUtils, DoctorService doctorService) {
    this.authenticationManager = authenticationManager;
    this.systemAdminService = systemAdminService;
    this.registrationService = registrationService;
    this.userService = userService;
    this.patientService = patientService;
    this.jwtUtils = jwtUtils;
    this.doctorService = doctorService;
  }

  public LoggedInDTO googleAuthenticateUser(GoogleAuthRequestDTO googleAuthRequestDTO) {

    GoogleAuthResponseDTO googleUserResponseDTO = getUserDetailsFromToken(googleAuthRequestDTO);
    User user = null;
    if(userService.existsByEmail(googleUserResponseDTO.getEmail())){
      user = userService.findByEmail(googleUserResponseDTO.getEmail());
    }
    if(user != null && !user.getSso()) {
      throw new BadCredentialsException("login with carelyo Credentials");
    }
    if (user == null) {
      SignupDTO.PatientSignupDTO patientSignupDTO = new PatientSignupDTO(
          googleUserResponseDTO.getEmail(),
          String.valueOf(ThreadLocalRandom.current().nextLong(1000000000L, 10000000000L)), googleUserResponseDTO.getGivenName(),
          googleUserResponseDTO.getFamilyName(), null, true, true, googleUserResponseDTO.getPicture());
      registrationService.registerPatient(patientSignupDTO);
    }
    return authenticateUser(new LoginDTO(googleUserResponseDTO.getEmail(), ""));
  }

  private GoogleAuthResponseDTO getUserDetailsFromToken(GoogleAuthRequestDTO googleAuthRequestDTO) {

    try{
      RestTemplate restTemplate = new RestTemplate();
      HttpHeaders httpHeaders = new HttpHeaders();
      httpHeaders.set("Authorization", "Bearer " + googleAuthRequestDTO.getAccessToken());
      HttpEntity<Object> httpEntity = new HttpEntity<>(httpHeaders);
      ResponseEntity<GoogleAuthResponseDTO> responseEntity = restTemplate.exchange(
          GOOGLE_USERINFO_URL, HttpMethod.GET, httpEntity, GoogleAuthResponseDTO.class);
      return responseEntity.getBody();
    }catch (Exception e){
      e.printStackTrace();
    }
    return null;
  }

  public LoggedInDTO authenticateUser(LoginDTO loginDTO) {

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginDTO.getEmail(),
            loginDTO.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);

    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    List<String> roles = userDetails.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .collect(Collectors.toList());

      // Log the roles to inspect them
    logger.info("User roles: {}", roles);

    if (roles.contains("DISABLED")) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
          "Account is disabled, Contact Support");
    }

    switch (roles.get(0)) {
      case "PATIENT":
        if (patientService.isPatientByUserId(userDetails.getId())) {
          Patient patient = patientService.getPatientByUserId(userDetails.getId());
          return new LoggedInDTO(patient.getId(), patient.getUserId(),
              userDetails.getMobile(),
              userDetails.getEmail(), jwt, roles);
        }
        break;
      case "DOCTOR":
        Doctor doctor = doctorService.getByUserId(userDetails.getId());
        doctorService.saveDoctor(doctor.updateSystemStatus(ESystemStatus.Available));
        return new LoggedInDTO(doctor.getId(), doctor.getUserId(), userDetails.getMobile(),
            userDetails.getEmail(), jwt, roles);
      case "SYSTEMADMIN":
        if (systemAdminService.getByUserIdOptional(userDetails.getId()).isPresent()) {
          SystemAdmin systemAdmin = systemAdminService.getByUserId(
              userDetails.getId());
          return new LoggedInDTO(systemAdmin.getId(), systemAdmin.getUserId(),
              userDetails.getMobile(),
              userDetails.getEmail(), jwt, roles);
        }
        break;
      case "CHILD":
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
            "Child account cannot login directly");
    }
    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect login details");
  }

}
