package com.carelyo.v1.dto.doctor;

import com.carelyo.v1.dto.ValidationMessages;
import java.time.LocalDateTime;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Value;

public class CalendarDTO {

  private CalendarDTO() {
  }

  @Value
  public static class Response {

    Long id;
    Long doctorId;
    String start;
    String end;
    String title;
    String description;
    String url;
    String color;
    Boolean availabilityStatus;
    Boolean allDay;
    Boolean patientAppointment;

  }

  @Value
  public static class Create {

    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime start;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime end;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String title;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    @Size(max = 100, message = ValidationMessages.INVALID_FIELD_SIZE)
    String description;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String url;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String color;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Boolean availabilityStatus;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Boolean allDay;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Boolean patientAppointment;
    Long childId;

  }

}
