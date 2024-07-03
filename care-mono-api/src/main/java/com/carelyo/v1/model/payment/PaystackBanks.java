package com.carelyo.v1.model.payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PaystackBanks {
  long id;
  String name;
  String slug;
  String code;
  String longCode;
  String gateway;
  Boolean payWithBank;
  Boolean active;
  String country;
  String currency;
  String type;
  Boolean isDeleted;

}
