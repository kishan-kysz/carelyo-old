package com.carelyo.v1.model.vitals;

import com.carelyo.v1.enums.EMenstruationFlow;
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
public class Menstruation extends BaseModel {

  Long userId;
  EMenstruationFlow flow;
  Boolean startOfCycle;
  LocalDateTime date;
  LocalDateTime endOfCycleDate;
  LocalDateTime startOfCycleDate;
  String contraceptive;
  Long childId;
}
