package com.carelyo.v1.model.user.patient;

import java.util.List;
import javax.persistence.ElementCollection;
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
public class Locale {

  @ElementCollection
  private List<String> languages;
  private String preferredLanguage;
  private String closestHospital;
}
