package com.carelyo.v1.dto.summary;

import com.carelyo.v1.dto.ValidationMessages;
import java.util.Set;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import lombok.Value;

@Value
public class TestDTO {

  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  String category;
  @NotEmpty(message = ValidationMessages.IS_REQUIRED)
  Set<String> procedures;

  @Value
  public static class AddTest {
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String category;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String procedure;
  }

}
