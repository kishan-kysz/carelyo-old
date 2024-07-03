package com.carelyo.v1.dto.admin;

import java.time.LocalDateTime;
import lombok.Value;

@Value
public class PatientUserResponseDTO {

  Long userId;
  String email;
  String mobile;
  LocalDateTime createdAt;
  LocalDateTime updatedAt;
}