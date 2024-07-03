package com.carelyo.v1.model.wallet;

import com.carelyo.v1.model.BaseModel;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Transaction extends BaseModel {

  Double amount;
  String account;
  String text;
  String reference;
  @Enumerated(EnumType.STRING)
  ETransactionType type;


}
