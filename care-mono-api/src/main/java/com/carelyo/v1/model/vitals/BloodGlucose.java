package com.carelyo.v1.model.vitals;

import com.carelyo.v1.model.BaseModel;
import java.time.LocalDateTime;
import javax.persistence.Column;
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
public class BloodGlucose extends BaseModel {
    Long userId;
    LocalDateTime date;
    @Column(name = "blood_glucose_mmol_per_l")
    Double bloodGlucoseMmolPerL;
    LocalDateTime mealTime;
    Long childId;
}
