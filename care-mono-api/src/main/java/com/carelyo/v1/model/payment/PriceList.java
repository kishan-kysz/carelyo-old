package com.carelyo.v1.model.payment;

import java.util.Map;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class PriceList {

  @Id
  private String name;
  @ElementCollection
  private Map<String, Double> prices;


}

