package com.carelyo.v1.controllers.admin;

import com.carelyo.v1.dto.accountnumber.AccountNumberDTO;
import com.carelyo.v1.dto.admin.AcceptingDoctorDTO;
import com.carelyo.v1.dto.admin.AmountPaidForPeriodDTO;
import com.carelyo.v1.dto.admin.ConsultationMetricsDTO;
import com.carelyo.v1.dto.admin.ConsultationMetricsPeriodDTO;
import com.carelyo.v1.dto.admin.ConsultationsGenderDistributionDTO;
import com.carelyo.v1.dto.admin.FinishedConsultationsRatingDistributionDTO;
import com.carelyo.v1.dto.admin.NumberOfConsultationsByAgeSpanResponseDTO;
import com.carelyo.v1.dto.admin.RelationshipDTO;
import com.carelyo.v1.dto.admin.TotalCompletedConsultationTimePerDoctorDTO;
import com.carelyo.v1.enums.EConsultationStatus;
import com.carelyo.v1.enums.admin.EPeriod;
import com.carelyo.v1.service.admin.MetricsService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("api/v1/admin/metrics")
@Tag(name = "Metrics", description = "The Metrics API")
public class MetricsController {

  private final MetricsService metricsService;

  public MetricsController(MetricsService metricsService) {

    this.metricsService = metricsService;
  }

  @Operation(summary = "Retrieves metrics for all the consultations, that have once been booked, for a set period of "
      +
      "time", description = "**Role:** `SYSTEMADMIN`\n\n" +
          "Retrieves metrics for all the consultations, that have once been booked, for a set period of "
          +
          "time.\n\n\n" +
          "Even if the start and or end date is in the middle of a year the metrics returned will still "
          +
          "contain the totals and averages for the whole years and not only the part that the search "
          +
          "period contains. The same goes for months, weeks, days and hours.\n\n\n" +
          "Another thing is that the week totals for the first and last weeks of the year also adds in the "
          +
          "number of consultations that are a part of the week that may overlap into/from the "
          +
          "next/last year. The averages for the weeks are also based on these totals.\n\n\n"
          +
          "Use this format for request parameters: \"yyyy-MM-ddTHH:mm:ss.SSSZ\"")
  @GetMapping("/consultations")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<ConsultationMetricsDTO> consultations(
      @Valid @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
      @Valid @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
    ConsultationMetricsPeriodDTO consultationMetricsPeriodDTO = new ConsultationMetricsPeriodDTO(startDate, endDate);
    return ResponseEntity.ok(metricsService.consultations(consultationMetricsPeriodDTO));
  }

  @Operation(summary = "Retrieves the doctors that are accepting consultations", description = "**Role:** `SYSTEMADMIN`")
  @GetMapping("/consultations/accepted/doctors")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<AcceptingDoctorDTO>> acceptingDoctors() {
    return ResponseEntity.ok(metricsService.acceptingDoctors());
  }

  @Operation(summary = "Retrieves the number of consultations by status", description = "**Role:** `SYSTEMADMIN`")
  @GetMapping("/consultations/total-by-status")
  @PreAuthorize("hasAuthority('SYSTEMADMIN') or hasRole('DOCTOR')")
  public ResponseEntity<Integer> getNumberOfConsultationsByStatus(
      @Valid @RequestParam("status") EConsultationStatus status,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.ok(metricsService.getNumberOfConsultationsByStatus(status, userDetails));
  }

  @Operation(summary = "Retrieves the total completed consultation time per doctor", description = "**Role:** `SYSTEMADMIN` `DOCTOR`")
  @GetMapping("/consultations/completed-time/total-per-doctor")
  @PreAuthorize("hasAuthority('SYSTEMADMIN') or hasAuthority('DOCTOR')")
  public ResponseEntity<List<TotalCompletedConsultationTimePerDoctorDTO>> getTotalCompletedConsultationTimePerDoctor() {
    return ResponseEntity.ok(metricsService.getTotalCompletedConsultationTimePerDoctor());
  }

  @Operation(summary = "Retrieves the consultations gender distribution", description = "**Role:** `SYSTEMADMIN`")
  @GetMapping("/consultations/gender-distribution")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<ConsultationsGenderDistributionDTO>> getConsultationsGenderDistribution() {
    return ResponseEntity.ok(metricsService.getConsultationsGenderDistribution());
  }

  @Operation(summary = "Retrieve the amount paid for consultations over a period of time", description = "**Role:** `SYSTEMADMIN`\n\n\n"
      +
      "Retrieve the amount paid for consultations over a period of time and for " +
      "a given period type, meaning years, months, weeks, days or hours.\n\n\n" +
      "Use this format for date request parameters: \"yyyy-MM-ddTHH:mm:ss.SSSZ\"")
  @GetMapping("/consultations/amount-paid")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<AmountPaidForPeriodDTO>> getAmountPaidForConsultations(
      @Valid @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
      @Valid @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
      @Valid @RequestParam("period") EPeriod period) {
    return ResponseEntity.ok(
        metricsService.getAmountPaidForConsultations(startDate, endDate, period));
  }

  @Operation(summary = "Retrieves the number of consultations by ages", description = "**Role:** `SYSTEMADMIN`\n\n" +
      "Retrieves the number of consultations for different age spans." +
      "\n\n\n" +
      "The age spans is calculated from the supplied ages in the way that the n:th " +
      "index constitutes the starting age in a span, in an inclusive way, while " +
      "the n:th + 1 index constitutes the final age in the same span, in a " +
      "non-inclusive way.\n\n\n" +
      "The age zero need never be specified because it is specified automatically.")
  @GetMapping("/consultations/total-by-age-spans")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<NumberOfConsultationsByAgeSpanResponseDTO>> getConsultationTotalsByAgeSpans(
      @Valid @RequestParam("ages") Integer[] ages) {
    return ResponseEntity.ok(metricsService.getConsultationTotalsByAgeSpans(ages));
  }

  @Operation(summary = "Retrieves a gender percentage of the prescription illnesses", description = "**Role:** `SYSTEMADMIN`")
  @GetMapping("/consultations/relationships/illness-and-gender")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<RelationshipDTO.IllnessAndGender>> getRelationshipIllnessAndGender() {
    return ResponseEntity.ok(metricsService.getRelationshipIllnessAndGender());
  }

  @Operation(summary = "Retrieves a age percentage of the prescription illnesses", description = "**Role:** `SYSTEMADMIN`")
  @GetMapping("/consultations/relationships/illness-and-age")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<RelationshipDTO.IllnessAndAge>> getRelationshipIllnessAndAge() {
    return ResponseEntity.ok(metricsService.getRelationshipIllnessAndAge());
  }

  @Operation(summary = "Retrieves a time of the day percentage of the prescription illnesses", description = "**Role:** `SYSTEMADMIN`")
  @GetMapping("/consultations/relationships/illness-and-time")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<RelationshipDTO.IllnessAndTime>> getRelationshipIllnessAndTime() {
    return ResponseEntity.ok(metricsService.getRelationshipIllnessAndTime());
  }

  @Operation(summary = "Retrieves the finished consultations rating distribution", description = "**Role:** `SYSTEMADMIN`")
  @GetMapping("/consultations/finished/rating-distribution")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<FinishedConsultationsRatingDistributionDTO>> getFinishedConsultationsRatingDistribution() {
    return ResponseEntity.ok(metricsService.getFinishedConsultationsRatingDistribution());
  }

  @Operation(summary = "Add accountnumber to doctor", description = "**Role:** `DOCTOR`")
  @PutMapping("/doctor/accountnumber")
  @PreAuthorize("hasAuthority('DOCTOR')")
  public ResponseEntity<String> addAccountNumberToDoctorProfile(
      @AuthenticationPrincipal UserDetailsImpl userDetails,
      @RequestBody AccountNumberDTO accountNumberDTO)
      throws NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, BadPaddingException,
      InvalidKeyException {
    metricsService.addAccountNumberToDoctor(userDetails.getId(), accountNumberDTO);
    return ResponseEntity.ok("Success");

  }

}
