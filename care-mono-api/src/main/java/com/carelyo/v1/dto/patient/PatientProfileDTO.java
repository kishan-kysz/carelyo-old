package com.carelyo.v1.dto.patient;

import com.carelyo.v1.dto.consultation.ConsultationDTO.ActiveConsultationPatient;
import com.carelyo.v1.dto.consultation.ConsultationDTO.UnratedConsultation;
import com.carelyo.v1.model.user.patient.Locale;
import com.carelyo.v1.model.user.patient.Location;
import com.carelyo.v1.model.user.patient.Polygenic;
import com.carelyo.v1.model.user.patient.Relationship;
import com.carelyo.v1.model.wallet.Wallet;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Value;

@Value
public class PatientProfileDTO {

  Long userId;
  String email;
  String mobile;
  Boolean profileComplete;
  Long patientId;
  String title;
  String nationalIdNumber;
  String firstName;
  String surName;
  LocalDateTime dateOfBirth;
  String maritalStatus;
  boolean hasChildren;
  int numOfChildren;
  List<Relationship> relationships;

  Polygenic polygenic;

  List<String> allergies;
  List<String> medicalProblems;
  List<String> disabilities;

  Location location;
  Locale locale;
  String referralCode;
  Long referralCount;
  Long providerId;
  Wallet wallet;
  ActiveConsultationPatient activeConsultation;
  List<UnratedConsultation> unratedConsultation;
  String profilePhoto;
  byte[] ninCard;
  String ninCardFileName;
  LocalDateTime createdAt;
  Boolean sso;
}
