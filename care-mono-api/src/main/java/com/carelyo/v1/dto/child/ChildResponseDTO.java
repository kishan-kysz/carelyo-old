package com.carelyo.v1.dto.child;

import com.carelyo.v1.model.user.patient.Polygenic;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class ChildResponseDTO {

  private Long childId;
  private String name;
  private LocalDateTime dateOfBirth;
  private PartnerDTO partner;
  private Long patientId;
  private String notes;
  private String status;
  private Polygenic polygenic;
  private List<String> allergies;
  private List<String> medicalProblems;
  private List<String> disabilities;

}
