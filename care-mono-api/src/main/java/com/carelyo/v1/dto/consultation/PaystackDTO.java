package com.carelyo.v1.dto.consultation;

import com.carelyo.v1.dto.ValidationMessages;
import java.io.Serializable;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.Setter;
import lombok.ToString;
import lombok.Value;

public class PaystackDTO {

  @Value
  public static class Request implements Serializable {

    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String amount;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    @Size(max = 50, message = ValidationMessages.INVALID_FIELD_SIZE)
    @Email(message = ValidationMessages.INVALID_FIELD_VALUE)
    String email;

  }

  @Value
  @Setter
  @ToString
  public static class Data {

    String authorization_url;
    String reference;
    String access_code;
    String clientSecret;
    String paymentProvider;

  }

}
