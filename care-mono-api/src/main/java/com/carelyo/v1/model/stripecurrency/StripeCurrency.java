package com.carelyo.v1.model.stripecurrency;

import com.carelyo.v1.model.BaseModel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class StripeCurrency extends BaseModel {
  @Column(unique = true)
  private String code;
  private boolean IsZeroDecimal;
  private boolean IsThreeDecimal;
  private boolean IsTreatedAsZeroDecimal;
  private boolean IsBackwardsCompatible;
}
