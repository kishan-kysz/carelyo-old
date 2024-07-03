package com.carelyo.v1.dto.payout;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import lombok.Value;

public class PayoutDTO {

  @Value
  public static class DoctorToBePaidResponse {

    Long id;
    String priceListName;
    Long serviceId;
    LocalDateTime dateOnPayslip;
    Double toBePaidOut;

  }

  @Value
  public static class DoctorPaidOutResponse {

    long id;
    String priceListName;
    long serviceId;
    LocalDateTime dateOnPayslip;
    LocalDateTime datePaidOut;
    String payoutReference;
    Double paidOut;


  }

  @Value
  public static class AdminPayRollResponse {

    long id;
    String priceListName;
    long serviceId;
    String payStackRef;
    ZonedDateTime dateOnPayroll;
    ZonedDateTime dateOnPayslip;
    ZonedDateTime datePaidOut;
    Long paidByUserId;
    String payoutReference;
    Double price;
    Double vat;
    Double commission;
    Double toBePaidOut;


  }
}
