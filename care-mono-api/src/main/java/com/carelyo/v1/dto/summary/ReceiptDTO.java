package com.carelyo.v1.dto.summary;

import java.time.LocalDateTime;
import lombok.Value;
import org.springframework.lang.Nullable;

@Value
public class ReceiptDTO {

  String patientName;
  @Nullable
  String patientNationalIdNumber;
  @Nullable
  String hospital;

  String amountPaid;

  LocalDateTime timeAccepted;

  LocalDateTime timeFinished;

}
