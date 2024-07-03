package com.carelyo.v1.service.external.externalpayment.dto;

import com.carelyo.v1.service.external.externalpayment.enums.Currency;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PaymentInfo {

    private BigDecimal price = BigDecimal.valueOf(666);
    private Currency currency;
    private Long providerId;
    private Long orderId;
    private String email;

    public PaymentInfo(Currency currency, Long providerId, String email) {
        this.currency = currency;
        this. providerId = providerId;
        this.email = email;
    }

    public PaymentInfo(Currency currency, Long providerId, String email, BigDecimal price) {
        this.currency = currency;
        this.providerId = providerId;
        this.email = email;
        this.price = price;
    }
}
