package com.carelyo.v1.dto.patient;

import com.carelyo.v1.dto.ValidationMessages;
import com.carelyo.v1.enums.ERelationshipAccessOptions;
import com.carelyo.v1.enums.ERelationshipRelation;
import com.carelyo.v1.enums.ERelationshipType;
import com.carelyo.v1.model.user.patient.Locale;
import com.carelyo.v1.model.user.patient.Location;
import java.time.LocalDateTime;
import java.util.List;
import javax.annotation.Nullable;
import javax.validation.constraints.NotNull;
import lombok.Value;

@Value
public class PatientDTO {

  Long userId;
  Long id;
  String email;
  String mobile;
  String referralCode;
  Long referralCount;
  Boolean profileComplete;
  Long providerId;
  String firstName;
  String surName;

  @Value
  public static class CompletePatientProfileDTO {

    String title;
    String firstName;
    String surName;
    LocalDateTime dateOfBirth;
    String gender;
    String country;
    String city;
    String community;
    String state;
    String address;
    List<String> language;
    String mobile;

  }

  @Value
  public static class UpdateProfileDTO {
    @Nullable
    String title;
    @Nullable
    String firstName;
    @Nullable
    String surName;
    @Nullable
    String maritalStatus;
    @Nullable
    String gender;
    @Nullable
    String bloodType;
    @Nullable
    Long heightCm;
    @Nullable
    Long weightKg;
    @Nullable
    List<String> allergies;
    @Nullable
    List<String> medicalProblems;
    @Nullable
    List<String> disabilities;
    @Nullable
    Location location;
    @Nullable
    Locale locale;
    Long providerId;
    String nationalIdNumber;
    String ninCardFileName;
  }

  @Value
  public static class PatientAgeAndGenderDTO {
    LocalDateTime age;
    String gender;
    Long id;
    Boolean isChild;
  }

  @Value
  public static class RelationshipDTO {
    ERelationshipRelation relation;
    ERelationshipType type;
    Long relatedUserId;
    Boolean access;
    Boolean canLogin;
    List<ERelationshipAccessOptions> accessOptions;
  }

  @Value
  public static class CreateRelationshipDTO {
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    ERelationshipRelation relation;
    @Nullable
    ERelationshipType type;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long relatedUserId;
    @Nullable
    Boolean access;
    @Nullable
    Boolean canLogin;
    @Nullable
    List<ERelationshipAccessOptions> accessOptions;
  }

  @Value
  public static class UpdateRelationshipDTO {
    @Nullable
    ERelationshipRelation relation;
    @Nullable
    ERelationshipType type;
    @Nullable
    Boolean access;
    @Nullable
    Boolean canLogin;
    @Nullable
    List<ERelationshipAccessOptions> accessOptions;
  }
}
