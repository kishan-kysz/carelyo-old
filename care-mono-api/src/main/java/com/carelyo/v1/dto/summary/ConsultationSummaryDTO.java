package com.carelyo.v1.dto.summary;

import com.carelyo.v1.model.consultation.ConsultationSBAR;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import lombok.Value;
import org.springframework.lang.Nullable;

@Value
public class ConsultationSummaryDTO {

  Long consultationId;

  Set<String> symptoms;

  Set<String> relatedSymptoms;

  String diagnosis;

  String doctorName;

  LocalDateTime timeFinished;
  @Nullable
  List<PrescriptionDTO> prescriptions;
  @Nullable
  List<LabrequestDTO> labrequests;
  @Nullable
  FollowUpDTO followUp;
  ConsultationSBAR sbar;
  String name;

}

