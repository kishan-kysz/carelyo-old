package com.carelyo.v1.dto.wallet;

import java.util.List;
import lombok.Value;

@Value
public class WalletDTO {

  List<TransactionDTO> transactions;
  Double balance;

}
