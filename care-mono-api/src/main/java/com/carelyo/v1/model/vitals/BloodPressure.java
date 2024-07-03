package com.carelyo.v1.model.vitals;

import com.carelyo.v1.model.BaseModel;
import java.time.LocalDateTime;
import javax.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BloodPressure extends BaseModel {

  Long userId;
  LocalDateTime date;
  Double systolicMmHg;
  Double diastolicMmHg;
  String posture;
  Long childId;
}
