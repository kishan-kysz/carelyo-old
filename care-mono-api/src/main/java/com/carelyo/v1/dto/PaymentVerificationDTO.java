package com.carelyo.v1.dto;

import lombok.Value;

import javax.validation.constraints.NotEmpty;

@Value
public class PaymentVerificationDTO {
  @NotEmpty
  String referenceId;
  /**
   * stripe or paystack
   */
  @NotEmpty
  String paymentProvider;
}
