package com.carelyo.v1.model.user.patient;

import javax.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class Polygenic {

  private Long heightCm;
  private Long weightKg;
  private String gender;
  private String bloodType;
}
