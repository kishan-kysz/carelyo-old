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
public class Location {

  private String address;
  private Long zipCode;
  private String community;
  private String city;
  private String state;
  private String country;

}
