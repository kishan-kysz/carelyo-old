package com.carelyo.v1.dto.summary;

import com.carelyo.v1.dto.ValidationMessages;
import com.carelyo.v1.model.summary.Labrequest;
import java.time.LocalDateTime;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Value;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LabrequestDTO {

  Long id;
  String doctorName;
  String patientName;
  @Max(value = 255, message = ValidationMessages.INVALID_FIELD_SIZE)
  String reason;
  String test;
  LocalDateTime createdAt;
  LocalDateTime updatedAt;

  public LabrequestDTO(Labrequest labrequest) {
    this.id = labrequest.getId();
    this.doctorName = labrequest.getDoctorName();
    this.patientName = labrequest.getPatientName();
    this.reason = labrequest.getReason();
    this.test = labrequest.getTest();
    this.createdAt = labrequest.getCreatedAt();
    this.updatedAt = labrequest.getUpdatedAt();
  }

  @Value
  public static class updateLabrequest {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long id;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String reason;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String test;

  }

  @Value
  public static class createLabrequest {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long consultationId;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String reason;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String test;

  }

  @Value
  public static class OngoingLabDTO {

    Long id;
    String reason;
    String test;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
  }

}
