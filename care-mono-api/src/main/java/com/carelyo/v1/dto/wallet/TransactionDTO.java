package com.carelyo.v1.dto.wallet;

import com.carelyo.v1.model.wallet.ETransactionType;
import java.time.LocalDateTime;
import lombok.Value;

@Value
public class TransactionDTO {

  LocalDateTime created;
  Integer amount;
  String account;
  String reference;
  String text;
  ETransactionType type;
}
