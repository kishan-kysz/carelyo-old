package com.carelyo.v1.dto.admin;

import com.carelyo.v1.enums.EConsultationStatus;
import java.time.LocalDateTime;
import lombok.Value;

@Value
public class ConsultationGetDTO {

  Long consultationId;
  LocalDateTime createdAt;
  LocalDateTime updatedAt;
  Boolean acceptedConsultations;
  String patientFullName;
  Long patientId;
  String doctorFullName;
  Long doctorId;
  String roomName;
  String transactionReference;
  String transactionUrl;
  String priceListName;
  String amountPaid;
  String language;
  EConsultationStatus status;
  LocalDateTime timeBooked;
  LocalDateTime timeAccepted;
  LocalDateTime timeStarted;
  LocalDateTime timeFinished;
  Long followUpId;
  Integer rating;
}
