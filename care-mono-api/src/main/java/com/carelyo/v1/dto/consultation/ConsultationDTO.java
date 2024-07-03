package com.carelyo.v1.dto.consultation;

import com.carelyo.v1.dto.Base64DTO;
import com.carelyo.v1.dto.ValidationMessages;
import com.carelyo.v1.dto.patient.PatientDTO.PatientAgeAndGenderDTO;
import com.carelyo.v1.dto.summary.ConsultationSummaryDTO;
import com.carelyo.v1.enums.EConsultationStatus;
import com.carelyo.v1.enums.EConsultationType;
import com.carelyo.v1.model.consultation.Consultation;
import com.carelyo.v1.model.consultation.ConsultationSBAR;
import com.carelyo.v1.service.consultation.SummaryService.CurrentSummary;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.Data;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.lang.Nullable;

@Log4j2
public class ConsultationDTO {

  @Value
  public static class UpdateActiveConsultation {

    @Nullable
    List<String> bodyArea;
    @Nullable
    String textDetailedDescription;
    @Nullable
    byte[] audioDetailedDescription;
    @Nullable
    String language;
    @Nullable
    List<Base64DTO> images;
  }

  @Value
  public static class InitializeTransactionRequest {

    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    Set<String> bodyArea;
    @Nullable
    String textDetailedDescription;
    @Nullable
    byte[] audioDetailedDescription;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Double amountPaid;
    @Nullable
    String priceListName;
    @Nullable
    List<Base64DTO> images;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    EConsultationType consultationType;
    @Nullable
    Long childId;

    }

  @Value
  public static class ConsultationResponse {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long id;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String patientFullName;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String patientMobileNumber;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long patientId;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String doctorFullName;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long doctorId;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    Set<String> bodyArea;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime timeBooked;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime timeAccepted;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime timeStarted;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime timeFinished;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    EConsultationStatus status;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    Set<String> symptoms;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    Set<String> relatedSymptoms;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String consultationUrl;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String roomName;
    @Nullable
    String textDetailedDescription;
    @Nullable
    byte[] audioDetailedDescription;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String transactionReference;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String amountPaid;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String language;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String doctorNote;

    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    Double duration;

    ConsultationSBAR sbar;
    EConsultationType consultationType;
    String priceListName;

  }

  @Value
  public static class ForDoctor {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long id;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String patientFullName;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String patientMobileNumber;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String roomName;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long patientId;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    Set<String> bodyArea;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    Set<String> symptoms;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    Set<String> relatedSymptoms;
    @Nullable
    String textDetailedDescription;
    @Nullable
    byte[] audioDetailedDescription;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String amountPaid;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String language;
    @NotBlank(message = ValidationMessages.INVALID_DATE)
    String dateOfBirth;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String gender;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String maritalStatus;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String heightCm;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String weight;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String bloodType;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String allergies;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String medicalProblems;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String disabilities;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String country;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String state;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String city;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String community;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String address;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String postCode;
    @Min(value = 0, message = ValidationMessages.IS_REQUIRED)
    int numberOfChildren;
    @NotBlank(message = ValidationMessages.IS_REQUIRED)
    String doctorNote;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime timeBooked;

  }

  @Value
  public static class BookedConsultationResponse {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long id;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    Set<String> bodyArea;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    ZonedDateTime timeBooked;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    EConsultationStatus status;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime age;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String gender;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String textDetailedDescription;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String language;
    EConsultationType consultationType;
    Long patientId;
    Boolean isChild;

    public BookedConsultationResponse(Consultation consultation, PatientAgeAndGenderDTO ageAndGenderDTO) {
      this.id = consultation.getId();
      this.bodyArea = consultation.getBodyArea();
      this.timeBooked = consultation.getTimeBooked().atZone(ZoneId.systemDefault()).withZoneSameInstant(ZoneId.of("UTC")); //TODO quick fix, need to change everywhere to UTC time
      this.status = consultation.getStatus();
      this.textDetailedDescription = consultation.getTextDetailedDescription();
      this.language = consultation.getLanguage();
      this.age = ageAndGenderDTO.getAge();
      this.gender = ageAndGenderDTO.getGender();
      this.patientId = ageAndGenderDTO.getId();
      this.isChild = ageAndGenderDTO.getIsChild();
      this.consultationType = consultation.getConsultationType();
    }

  }

  @Value
  public static class FinishedConsultation {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long id;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String patientFullName;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String doctorFullName;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    Set<String> bodyArea;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime timeBooked;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime timeAccepted;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime timeStarted;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime timeFinished;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    Set<String> symptoms;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    Set<String> relatedSymptoms;
    @Nullable
    String textDetailedDescription;
    @Nullable
    byte[] audioDetailedDescription;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    String amountPaid;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String doctorNote;

  }

  @Value
  public static class AcceptConsultationResponse {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long id;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String roomName;
    EConsultationType consultationType;
    String priceListName;

  }

  @Value
  public static class BookedConsultation {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long id;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    EConsultationStatus status;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime timeBooked;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String referenceId;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String transactionUrl;
    String clientSecret;
    String paymentProvider;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    Double duration;

  }

  @Value
  public static class BookedConsultationForChild {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long id;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    EConsultationStatus status;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime timeBooked;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime timeAccepted;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime timeStarted;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    LocalDateTime timeFinished;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String transactionReference;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String transactionUrl;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    Double duration;
    @NotNull(message = ValidationMessages.IS_REQUIRED)
    Long patientId;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String bookingFor;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    String priceListName;


  }

  @Value
  public static class FinishConsultation {

    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    Set<String> symptoms;
    @NotEmpty(message = ValidationMessages.IS_REQUIRED)
    Set<String> relatedSymptoms;

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    SbarDTO sbar;

  }

  @Value
  public static class PatientInfo {

    String name;
    LocalDateTime dateOfBirth;
    Long patientId;
    String gender;
    String address;
    String community;
    List<String> language;
    String bloodType;
    List<String> allergies;
    List<String> disabilities;
    Long height;
    Long weight;
    List<String> medicalProblems;
    String parentName;
    Boolean isChild;

  }

  @Value
  public static class DoctorInfo {

    String name;
    Long doctorId;
  }

  @Value
  public static class BaseConsultation {

    Long id;

    LocalDateTime timeBooked;

    LocalDateTime timeAccepted;

    LocalDateTime timeStarted;

    LocalDateTime timeFinished;

    EConsultationStatus status;

    Set<String> symptoms;

    Set<String> relatedSymptoms;

    String consultationUrl;

    String roomName;
    @Nullable
    String textDetailedDescription;
    @Nullable
    byte[] audioDetailedDescription;
    String transactionReference;
    String amountPaid;
    String language;
    String diagnosis;
    Double duration;
    Set<String> bodyArea;
    ConsultationSBAR sbar;
    String priceListName;
    EConsultationType consultationType;


    public BaseConsultation(Consultation consultation) throws SQLException {
      this.id = consultation.getId();
      this.timeBooked = consultation.getTimeBooked();
      this.timeAccepted = consultation.getTimeAccepted();
      this.timeStarted = consultation.getTimeStarted();
      this.timeFinished = consultation.getTimeFinished();
      this.status = consultation.getStatus();
      this.symptoms = consultation.getSymptoms();
      this.relatedSymptoms = consultation.getRelatedSymptoms();
      this.consultationUrl = consultation.getConsultationUrl();
      this.roomName = consultation.getRoomName();
      this.textDetailedDescription = consultation.getTextDetailedDescription();
      this.audioDetailedDescription = consultation.getAudioDetailedDescription();
      this.transactionReference = consultation.getTransactionReference();
      this.amountPaid = consultation.getAmountPaid();
      this.language = consultation.getLanguage();
      this.diagnosis = consultation.getSbar().getDiagnosis();
      this.bodyArea = consultation.getBodyArea();
      this.sbar = consultation.getSbar();
      this.priceListName = consultation.getPriceListName();
      this.consultationType = consultation.getConsultationType();
      this.duration = consultation.getDuration();
    }

  }

  @Data
  public static class AcceptedConsultation {

    BaseConsultation consultation;
    PatientInfo patientInfo;
    DoctorInfo doctor;
    @Nullable
    List<ConsultationSummaryDTO> history;
    CurrentSummary currentConsultation;
    List<String> images;


  }

  @Value
  public static class RateConsultation {

    @NotNull(message = ValidationMessages.IS_REQUIRED)
    @Min(value = 1, message = ValidationMessages.INVALID_FIELD_VALUE)
    @Max(value = 5, message = ValidationMessages.INVALID_FIELD_VALUE)
    int rating;


  }

  @Value
  public static class UnratedConsultation {

    Long id;
    LocalDateTime date;
    String DoctorName;
  }

  @Value
  public static class ActiveConsultationPatient {

    Long id;
    LocalDateTime createdAt;
    EConsultationStatus status;
    String transactionReference;
    String transactionUrl;
    String consultationUrl;
    EConsultationType type;
  }

  @Data
  public static class ActiveConsultationDoctor {

    Long id;
    LocalDateTime startAt;
    EConsultationStatus status;
    String transactionReference;
    String roomName;
    String patientName;

    public ActiveConsultationDoctor(@Nullable Consultation consultation) {
      if (consultation == null) {
        return;
      }
      this.id = consultation.getId();
      this.startAt = consultation.getTimeStarted();
      this.status = consultation.getStatus();
      this.transactionReference = consultation.getTransactionReference();
      this.roomName = consultation.getRoomName();
      this.patientName = consultation.getPatientFullName();
    }
  }

  @Value
  public static class ChildConsultation {

    String paystackUrl;
    String paystackReference;
  }

}
