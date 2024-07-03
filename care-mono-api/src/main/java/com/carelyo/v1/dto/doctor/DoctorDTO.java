package com.carelyo.v1.dto.doctor;

import com.carelyo.v1.dto.ValidationMessages;
import com.carelyo.v1.dto.consultation.ConsultationDTO.ActiveConsultationDoctor;
import com.carelyo.v1.enums.EAccoladeTypes;
import com.carelyo.v1.enums.EDoctorAccountType;
import com.carelyo.v1.enums.EDoctorStatus;
import com.carelyo.v1.enums.ESystemStatus;
import java.time.LocalDateTime;
import javax.annotation.Nullable;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Value;
import org.springframework.validation.annotation.Validated;

@Value
public class DoctorDTO {

  Long userId;
  ESystemStatus systemStatus;
  EDoctorStatus accountStatus;
  EDoctorAccountType accountType;
  String firstName;
  String lastName;
  String gender;
  LocalDateTime dateOfBirth;
  String university;
  LocalDateTime graduationDate;
  String studentIdNumber;
  Long nationalIdNumber;
  String city;
  String state;
  String country;
  String street;
  Long streetNumber;
  Long zipCode;
  String hospital;
  String workAddress;
  String workEmail;
  String workMobile;
  String mobile;
  String email;
  String referralCode;
  Long referralCount;
  String avatar;
  Double rating;

  @Value
  public static class CompleteProfileDTO {

    // Personal Details
    @Nullable
    Long userId;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String firstName;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String lastName;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime dateOfBirth;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String gender;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String university;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime graduationDate;


    @Nullable
    @Size(max = 50, message = ValidationMessages.INVALID_FIELD_SIZE)
    String studentIdNumber;

    // Contact Details
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String city;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String state;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String country;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String street;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long zipCode;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long streetNumber;

    // Work Details
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String hospital;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String workAddress;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    String workMobile;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    @Email(message = ValidationMessages.INVALID_FIELD_VALUE)
    String workEmail;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Boolean consent;


  }

  @Value
  @Validated
  public static class CreateAccoladeDTO {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long doctorId;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String name;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    @Size(max = 100, message = ValidationMessages.INVALID_FIELD_SIZE)
    String description;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long year;

  }

  @Value
  public static class UpdateAccoladeDTO {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long id;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    EAccoladeTypes name;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String description;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long year;

  }

  @Value
  public static class Response {

    Long userId;
    ESystemStatus systemStatus;
    EDoctorStatus accountStatus;
    EDoctorAccountType accountType;
    String firstName;
    String lastName;
    String gender;
    LocalDateTime dateOfBirth;
    String university;
    LocalDateTime graduationDate;
    String studentIdNumber;
    Long nationalIdNumber;
    String city;
    String state;
    String country;
    String street;
    Long streetNumber;
    Long zipCode;
    String hospital;
    String workAddress;
    String workEmail;
    String workMobile;
    String mobile;
    String email;
    String referralCode;
    Long referralCount;
    String avatar;
    Double rating;
    ActiveConsultationDoctor activeConsultation;
    Long providerId;
  }

}
