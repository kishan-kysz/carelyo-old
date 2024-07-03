package com.carelyo.v1.dto.auth;

import com.carelyo.v1.dto.ValidationMessages;
import com.carelyo.v1.model.user.doctor.MedicalCertificate;
import javax.annotation.Nullable;
import javax.persistence.Embedded;
import javax.validation.Valid;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.ToString;
import lombok.Value;

public class SignupDTO {

  public enum Roles {
    patient, doctor, admin
  }

  @Value
  public static class UserSignupDTO {

    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    @Size(max = 50, message = ValidationMessages.INVALID_FIELD_SIZE)
    @Email(message = ValidationMessages.INVALID_FIELD_VALUE)
    String email;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    @Size(min = 6, max = 40, message = ValidationMessages.INVALID_FIELD_SIZE)
    String password;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String mobile;
    Roles role;
    @Nullable
    String firstName;
    @Nullable
    String lastName;
    @Nullable
    @Embedded
    MedicalCertificate medicalCertificate;
    @Nullable
    Long nationalIdNumber;
    @Nullable
    String hospital;

    Boolean consent;

    Long providerId;
    String accountNumber;


    @Nullable
    public MedicalCertificate getMedicalCertificate() {
      return this.medicalCertificate;
    }

  }

  @Value
  @AllArgsConstructor
  public static class AdminSignupDTO {

    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    @Size(max = 50, message = ValidationMessages.INVALID_FIELD_SIZE)
    @Email(message = ValidationMessages.INVALID_FIELD_VALUE)
    String email;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    @Size(min = 6, max = 40, message = ValidationMessages.INVALID_FIELD_SIZE)
    String password;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String mobile;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String firstName;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String lastName;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    Boolean sso;

  }

  @Value
  @ToString
  public static class DoctorSignupDTO {

    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String mobile;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    @Size(max = 50, message = ValidationMessages.INVALID_FIELD_SIZE)
    @Email(message = ValidationMessages.INVALID_FIELD_VALUE)
    String email;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String firstName;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String lastName;
    @Valid
    @Embedded
    MedicalCertificate medicalCertificate;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long nationalIdNumber;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String hospital;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Boolean consent;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long providerId;


    public DoctorSignupDTO(String mobile, String email, String firstName,
        String lastName, MedicalCertificate medicalCertificate, Long nationalIdNumber,
        String hospital, Boolean consent, Long providerId) {
      this.mobile = mobile;
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.medicalCertificate = medicalCertificate;
      this.nationalIdNumber = nationalIdNumber;
      this.hospital = hospital;
      this.consent = consent;
      this.providerId = providerId;
    }

  }

  @Value
  public static class PatientSignupDTO {

    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    @Size(max = 50, message = ValidationMessages.INVALID_FIELD_SIZE)
    @Email(message = ValidationMessages.INVALID_FIELD_VALUE)
    String email;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String mobile;
    String firstName;
    String lastName;
    @Nullable
    String referralCode;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Boolean consent;
    Boolean sso;

    String profilePhoto;


    public PatientSignupDTO(String email, String mobile, String firstName,
        String lastName, @Nullable String referralCode,
        Boolean consent, Boolean sso, String profilePhoto) {
      this.email = email;
      this.mobile = mobile;
      this.firstName = firstName;
      this.lastName = lastName;
      this.referralCode = referralCode;
      this.consent = consent;
      this.sso = sso;
      this.profilePhoto = profilePhoto;
    }

  }

}
