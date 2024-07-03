package com.carelyo.v1.dto.topup;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UnverifiedTopUpDTO {

  private Long id;
  private String reference;
  private String name;
  private Double amountPaid;
  private String bank;
  private String accountNumber;
}
