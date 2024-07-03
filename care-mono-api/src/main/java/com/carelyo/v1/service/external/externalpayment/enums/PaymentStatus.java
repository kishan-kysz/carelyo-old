package com.carelyo.v1.service.external.externalpayment.enums;

public enum PaymentStatus {
    PENDING,
    SUCCESS,
    FAILURE;

    public boolean isValidPaymentStatus() {
        return this == SUCCESS || this == FAILURE;
    }
}
