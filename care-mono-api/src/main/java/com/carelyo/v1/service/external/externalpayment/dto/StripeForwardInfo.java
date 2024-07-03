package com.carelyo.v1.service.external.externalpayment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StripeForwardInfo {
    private Long amount;
    private String currency;
    private Long providerId;
    private String orderId;
}