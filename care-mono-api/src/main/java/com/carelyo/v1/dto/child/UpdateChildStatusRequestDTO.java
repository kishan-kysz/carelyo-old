package com.carelyo.v1.dto.child;

import com.carelyo.v1.enums.EChildStatus;
import lombok.Data;

@Data
public class UpdateChildStatusRequestDTO {

  private Long childId;
  private EChildStatus status;
  private String notes;

}