package com.carelyo.v1.model.payment;

import java.time.LocalDateTime;
import javax.persistence.Entity;
import javax.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Entity
@ToString
@Builder
@AllArgsConstructor
public class PayStackData {

  @Id
  String reference;
  String domain;
  String status;
  Double amount;
  LocalDateTime paidAt;

  public PayStackData() {

  }
}
