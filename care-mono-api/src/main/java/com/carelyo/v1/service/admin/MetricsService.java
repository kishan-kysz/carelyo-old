package com.carelyo.v1.service.admin;

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
import com.carelyo.v1.model.consultation.Consultation;
import com.carelyo.v1.model.summary.Prescription;
import com.carelyo.v1.model.user.User;
import com.carelyo.v1.model.user.doctor.Doctor;
import com.carelyo.v1.model.user.patient.Patient;
import com.carelyo.v1.model.wallet.Wallet;
import com.carelyo.v1.service.consultation.ConsultationService;
import com.carelyo.v1.service.consultation.PrescriptionService;
import com.carelyo.v1.service.doctor.DoctorService;
import com.carelyo.v1.service.patient.PatientService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.user.UserService;
import com.carelyo.v1.service.wallet.WalletService;
import com.carelyo.v1.utils.AppUtils;
import java.security.InvalidKeyException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.Year;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.IsoFields;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MetricsService {

  private final ConsultationService consultationService;
  private final PatientService patientService;
  private final DoctorService doctorService;
  private final UserService userService;
  private final PrescriptionService prescriptionService;
  private final WalletService walletService;

  public MetricsService(
      ConsultationService consultationService,
      PatientService patientService,
      DoctorService doctorService,
      UserService userService,
      PrescriptionService prescriptionService,
      WalletService walletService) {
    this.consultationService = consultationService;
    this.patientService = patientService;
    this.doctorService = doctorService;
    this.userService = userService;
    this.prescriptionService = prescriptionService;
    this.walletService = walletService;
  }


  /**
   * Gets the number of weeks in a specific month.
   *
   * @param year  The year the month is in
   * @param month The month
   * @return The number of weeks in the given month
   */
  private long getWeeksInMonth(int year, int month) {
    YearMonth yearMonth = YearMonth.of(year, month);

    LocalDateTime monthStart = yearMonth.atDay(1).atStartOfDay();
    LocalDateTime monthEnd = yearMonth.atEndOfMonth().atStartOfDay();

    LocalDateTime calendarStart = monthStart.with(
        TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
    LocalDateTime calendarEnd = monthEnd.with(TemporalAdjusters.next(DayOfWeek.MONDAY));

    return ChronoUnit.WEEKS.between(calendarStart, calendarEnd);
  }

  /**
   * Gets the number of weeks in a specific year.
   *
   * @param year The year
   * @return The number of weeks in the given year
   */
  private long getWeeksInYear(int year) {
    Year yearToCalculateWeeksFrom = Year.of(year);

    LocalDateTime yearStart = yearToCalculateWeeksFrom.atDay(1).atStartOfDay();
    LocalDateTime yearEnd = yearToCalculateWeeksFrom.atDay(yearToCalculateWeeksFrom.length())
        .atStartOfDay();

    LocalDateTime calendarStart = yearStart.with(
        TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
    LocalDateTime calendarEnd = yearEnd.with(TemporalAdjusters.next(DayOfWeek.MONDAY));

    return ChronoUnit.WEEKS.between(calendarStart, calendarEnd);
  }

  /**
   * Checks if the last week of a year overlaps into the next year.
   *
   * @param year The year
   * @return True if the last week overlaps into the next year and false otherwise
   */
  private boolean doesLastWeekOfYearOverlap(int year) {
    Year yearToTest = Year.of(year);

    LocalDateTime firstYear = yearToTest.atDay(yearToTest.length()).atStartOfDay();
    LocalDateTime secondYear = yearToTest.atDay(1).plusYears(1L).atStartOfDay();

    return firstYear.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR) == secondYear.get(
        IsoFields.WEEK_OF_WEEK_BASED_YEAR);
  }

  /**
   * Checks if the first week of a year overlaps from the last year.
   *
   * @param year The year
   * @return True if the first week overlaps from the last year and false otherwise
   */
  private boolean doesFirstWeekOfYearOverlap(int year) {
    return doesLastWeekOfYearOverlap(year - 1);
  }

  /**
   * Checks if a date is in the last week of the year.
   *
   * @param date The date
   * @return True if the date is in the last week of the year and false otherwise
   */
  private boolean isDateInTheLastWeekOfTheYear(LocalDateTime date) {
    Month monthOfDate = date.getMonth();
    int dateWeekOfYear = date.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
    int lastWeekOfYear = date.truncatedTo(ChronoUnit.DAYS)
        .with(TemporalAdjusters.lastDayOfYear()).get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);

    return (dateWeekOfYear == lastWeekOfYear) &&
        (monthOfDate == Month.DECEMBER);
  }

  /**
   * Checks if a date is in the first week of the year.
   *
   * @param date The date
   * @return True if the date is in the first week of the year and false otherwise
   */
  private boolean isDateInTheFirstWeekOfTheYear(LocalDateTime date) {
    Month monthOfDate = date.getMonth();
    int dateWeekOfYear = date.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
    int firstWeekOfYear = date.truncatedTo(ChronoUnit.DAYS).withDayOfYear(1)
        .get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);

    return (dateWeekOfYear == firstWeekOfYear) &&
        (monthOfDate == Month.JANUARY);
  }

  /**
   * Retrieves the age of a patient.
   *
   * @param patient The patient
   * @return The age
   */
  private int getAgeOfPatient(Patient patient) {
    LocalDateTime birthDate = patient.getDateOfBirth();
    LocalDateTime nowDate = LocalDateTime.now();

    return nowDate.getYear() - birthDate.getYear();
  }

  /**
   * Retrieves all the consultation illnesses.
   *
   * @return The illnesses
   */
  private Map<Long, ArrayList<String>> getConsultationIllnesses() {
    List<Prescription> prescriptions = prescriptionService.getAllPrescriptions();

    Map<Long, ArrayList<String>> consultationIllnesses = new HashMap<>();

    for (Prescription prescription : prescriptions) {

      Long consultationId = prescription.getConsultationId();
      String illness = prescription.getIllness();

      if (!consultationIllnesses.containsKey(consultationId)) {
        consultationIllnesses.put(consultationId, new ArrayList<>());
        consultationIllnesses.get(consultationId).add(illness);
      } else {
        if (!consultationIllnesses.get(consultationId).contains(illness)) {
          consultationIllnesses.get(consultationId).add(illness);
        }
      }
    }

    return consultationIllnesses;
  }

  /**
   * Retrieves metrics for all the consultations, that have once been booked, for a set period of time.
   *
   * <p>
   * Even if the start and or end date is in the middle of a year the metrics returned will still contain the totals and
   * averages for the whole years and not only the part that the search period contains. The same goes for months,
   * weeks, days and hours.
   * <p>
   * Another thing is that the week totals for the first and last weeks of the year also adds in the number of
   * consultations that are a part of the week that may overlap into/from the next/last year. The averages for the weeks
   * are also based on these totals.
   *
   * @param consultationMetricsPeriodDTO Contains the start and end dates for the period
   * @return The metrics for the consultations
   */
  public ConsultationMetricsDTO consultations(
      ConsultationMetricsPeriodDTO consultationMetricsPeriodDTO) {

    // The start and end dates for the search period are initialized
    LocalDateTime periodStartDate = consultationMetricsPeriodDTO.getStartDate();
    LocalDateTime periodEndDate = consultationMetricsPeriodDTO.getEndDate();

    // The start and end dates to get the data for are initialized
    LocalDateTime dataStartDate = periodStartDate.truncatedTo(ChronoUnit.DAYS).withDayOfYear(1);
    LocalDateTime dataEndDate =
        periodEndDate.plusYears(1L).truncatedTo(ChronoUnit.DAYS).withDayOfYear(1)
            .minusNanos(1L);

    List<Consultation> consultations =
        consultationService.getAllConsultationsByTimeBookedBetween(
            dataStartDate,
            dataEndDate);

    // The data to be returned is initialized
    int totalNumberOfConsultations = 0;
    Map<String, Integer> totalNumberOfConsultationsPerYear = new HashMap<>();
    Map<String, Integer> totalNumberOfConsultationsPerMonth = new HashMap<>();
    Map<String, Integer> totalNumberOfConsultationsPerWeek = new HashMap<>();
    Map<String, Integer> totalNumberOfConsultationsPerDay = new HashMap<>();
    Map<String, Integer> totalNumberOfConsultationsPerHour = new HashMap<>();

    Map<String, Double> avgNumberOfConsultationsPerHourPerYear = new HashMap<>();
    Map<String, Double> avgNumberOfConsultationsPerHourPerMonth = new HashMap<>();
    Map<String, Double> avgNumberOfConsultationsPerHourPerWeek = new HashMap<>();
    Map<String, Double> avgNumberOfConsultationsPerHourPerDay = new HashMap<>();

    Map<String, Double> avgNumberOfConsultationsPerDayPerYear = new HashMap<>();
    Map<String, Double> avgNumberOfConsultationsPerDayPerMonth = new HashMap<>();
    Map<String, Double> avgNumberOfConsultationsPerDayPerWeek = new HashMap<>();

    Map<String, Double> avgNumberOfConsultationsPerWeekPerYear = new HashMap<>();
    Map<String, Double> avgNumberOfConsultationsPerWeekPerMonth = new HashMap<>();

    Map<String, Double> avgNumberOfConsultationsPerMonthPerYear = new HashMap<>();

    for (Consultation consultation : consultations) {
      LocalDateTime timeBooked =
          LocalDateTime.ofInstant(
              Instant.ofEpochMilli(consultation.getTimeBooked().atZone(
                  ZoneId.systemDefault()).toInstant().toEpochMilli()),
              ZoneOffset.UTC);

      Long timeBookedToInstant = timeBooked.atZone(
          ZoneId.systemDefault()).toInstant().toEpochMilli();

      // The total number of consultations
      if (
          timeBookedToInstant >= periodStartDate.atZone(
              ZoneId.systemDefault()).toInstant().toEpochMilli() &&
              timeBookedToInstant <= periodEndDate.atZone(
                  ZoneId.systemDefault()).toInstant().toEpochMilli()
      ) {
        totalNumberOfConsultations++;
      }

      // The total number of consultations per year
      LocalDateTime periodStartDateTemp = periodStartDate.truncatedTo(ChronoUnit.DAYS)
          .withDayOfYear(1);
      LocalDateTime periodEndDateTemp =
          periodEndDate.plusYears(1L).truncatedTo(ChronoUnit.DAYS).withDayOfYear(1)
              .minusNanos(1L);
      if (
          timeBookedToInstant >= periodStartDateTemp.atZone(
              ZoneId.systemDefault()).toInstant().toEpochMilli() &&
              timeBookedToInstant <= periodEndDateTemp.atZone(
                  ZoneId.systemDefault()).toInstant().toEpochMilli()
      ) {
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy");
        totalNumberOfConsultationsPerYear.merge(timeBooked.format(dateTimeFormatter), 1,
            Integer::sum);
      }

      // The total number of consultations per month
      periodStartDateTemp = periodStartDate.truncatedTo(ChronoUnit.DAYS).withDayOfMonth(1);
      periodEndDateTemp =
          periodEndDate.plusMonths(1L).truncatedTo(ChronoUnit.DAYS).withDayOfMonth(1)
              .minusNanos(1L);
      if (
          timeBookedToInstant >= periodStartDateTemp.atZone(
              ZoneId.systemDefault()).toInstant().toEpochMilli() &&
              timeBookedToInstant <= periodEndDateTemp.atZone(
                  ZoneId.systemDefault()).toInstant().toEpochMilli()
      ) {
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM");
        totalNumberOfConsultationsPerMonth.merge(timeBooked.format(dateTimeFormatter), 1,
            Integer::sum);
      }

      // The total number of consultations per day
      periodStartDateTemp = periodStartDate.truncatedTo(ChronoUnit.DAYS);
      periodEndDateTemp = periodEndDate.plusDays(1L).truncatedTo(ChronoUnit.DAYS)
          .minusNanos(1L);
      if (
          timeBookedToInstant >= periodStartDateTemp.atZone(
              ZoneId.systemDefault()).toInstant().toEpochMilli() &&
              timeBookedToInstant <= periodEndDateTemp.atZone(
                  ZoneId.systemDefault()).toInstant().toEpochMilli()
      ) {
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        totalNumberOfConsultationsPerDay.merge(timeBooked.format(dateTimeFormatter), 1,
            Integer::sum);
      }

      // The total number of consultations per hour
      periodStartDateTemp = periodStartDate.truncatedTo(ChronoUnit.HOURS);
      periodEndDateTemp = periodEndDate.plusHours(1L).truncatedTo(ChronoUnit.HOURS)
          .minusNanos(1L);
      if (
          timeBookedToInstant >= periodStartDateTemp.atZone(
              ZoneId.systemDefault()).toInstant().toEpochMilli() &&
              timeBookedToInstant <= periodEndDateTemp.atZone(
                  ZoneId.systemDefault()).toInstant().toEpochMilli()
      ) {
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(
            "yyyy-MM-dd'T'HH");
        totalNumberOfConsultationsPerHour.merge(timeBooked.format(dateTimeFormatter), 1,
            Integer::sum);
      }

      // The total number of consultations per week
      periodStartDateTemp = periodStartDate.truncatedTo(ChronoUnit.DAYS)
          .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
      periodEndDateTemp = periodEndDate.truncatedTo(ChronoUnit.HOURS)
          .with(TemporalAdjusters.next(DayOfWeek.MONDAY)).minusNanos(1L);
      if (
          timeBookedToInstant >= periodStartDateTemp.atZone(
              ZoneId.systemDefault()).toInstant().toEpochMilli() &&
              timeBookedToInstant <= periodEndDateTemp.atZone(
                  ZoneId.systemDefault()).toInstant().toEpochMilli()
      ) {
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-Www");

        if (isDateInTheLastWeekOfTheYear(timeBooked)) {
          if (doesLastWeekOfYearOverlap(timeBooked.getYear())) {
            LocalDateTime tempDate = timeBooked.truncatedTo(ChronoUnit.DAYS)
                .plusYears(1L).withDayOfYear(1);
            totalNumberOfConsultationsPerWeek.merge(tempDate.format(dateTimeFormatter),
                1, Integer::sum);
          }
        }

        if (isDateInTheFirstWeekOfTheYear(timeBooked)) {
          if (doesFirstWeekOfYearOverlap(timeBooked.getYear())) {
            LocalDateTime tempDate = timeBooked.truncatedTo(ChronoUnit.DAYS)
                .minusYears(1L).with(TemporalAdjusters.lastDayOfYear());
            totalNumberOfConsultationsPerWeek.merge(tempDate.format(dateTimeFormatter),
                1, Integer::sum);
          }
        }

        totalNumberOfConsultationsPerWeek.merge(timeBooked.format(dateTimeFormatter), 1,
            Integer::sum);
      }
    }

    // The averages are calculated from the totals retrieved earlier
    totalNumberOfConsultationsPerYear.forEach((key, value) -> {
      int numberOfDaysInYear = Year.of(Integer.parseInt(key.substring(0, 4))).length();
      avgNumberOfConsultationsPerHourPerYear.put(key,
          ((double) value / numberOfDaysInYear / 24));
      avgNumberOfConsultationsPerDayPerYear.put(key, ((double) value / numberOfDaysInYear));

      long numberOfWeeksInYear = getWeeksInYear(Integer.parseInt(key.substring(0, 4)));
      avgNumberOfConsultationsPerWeekPerYear.put(key, ((double) value / numberOfWeeksInYear));

      avgNumberOfConsultationsPerMonthPerYear.put(key, ((double) value / 12));
    });

    totalNumberOfConsultationsPerMonth.forEach((key, value) -> {
      int numberOfDaysInMonth = YearMonth.of(
          Integer.parseInt(key.substring(0, 4)),
          Integer.parseInt(key.substring(5, 7))).lengthOfMonth();
      avgNumberOfConsultationsPerHourPerMonth.put(key,
          ((double) value / numberOfDaysInMonth / 24));
      avgNumberOfConsultationsPerDayPerMonth.put(key, ((double) value / numberOfDaysInMonth));

      long numberOfWeeksInMonth = getWeeksInMonth(
          Integer.parseInt(key.substring(0, 4)), Integer.parseInt(key.substring(5, 7)));
      avgNumberOfConsultationsPerWeekPerMonth.put(key,
          ((double) value / numberOfWeeksInMonth));
    });

    totalNumberOfConsultationsPerWeek.forEach((key, value) -> {
      avgNumberOfConsultationsPerHourPerWeek.put(key, ((double) value / 7 / 24));
      avgNumberOfConsultationsPerDayPerWeek.put(key, ((double) value / 7));
    });

    totalNumberOfConsultationsPerDay.forEach((key, value) ->
        avgNumberOfConsultationsPerHourPerDay.put(key, ((double) value / 24)));

    return new ConsultationMetricsDTO(
        totalNumberOfConsultations,
        totalNumberOfConsultationsPerYear,
        totalNumberOfConsultationsPerMonth,
        totalNumberOfConsultationsPerWeek,
        totalNumberOfConsultationsPerDay,
        totalNumberOfConsultationsPerHour,
        avgNumberOfConsultationsPerHourPerYear,
        avgNumberOfConsultationsPerHourPerMonth,
        avgNumberOfConsultationsPerHourPerWeek,
        avgNumberOfConsultationsPerHourPerDay,
        avgNumberOfConsultationsPerDayPerYear,
        avgNumberOfConsultationsPerDayPerMonth,
        avgNumberOfConsultationsPerDayPerWeek,
        avgNumberOfConsultationsPerWeekPerYear,
        avgNumberOfConsultationsPerWeekPerMonth,
        avgNumberOfConsultationsPerMonthPerYear
    );
  }

  /**
   * Retrieves the doctors that are accepting consultations.
   *
   * @return The doctors
   */
  public List<AcceptingDoctorDTO> acceptingDoctors() {
    List<Consultation> consultations =
        consultationService.getAllConsultationsByStatus(EConsultationStatus.accepted);

    if (consultations.isEmpty()) {
      return new ArrayList<>();
    }

    return consultations.stream().map(
        consultation -> {
          Doctor doctor = doctorService.getByUserId(consultation.getDoctorId());
          User user = userService.getUserById(doctor.getUserId());

          return new AcceptingDoctorDTO(
              user.getId(),
              user.getEmail(),
              doctor.getFirstName(),
              doctor.getLastName()
          );
        }
    ).collect(Collectors.toList());
  }

  /**
   * Retrieves the number of consultations by status.
   *
   * @return The number of consultations
   */
  public int getNumberOfConsultationsByStatus(EConsultationStatus status, UserDetailsImpl userDetails) {
    // Case Doctor
    if (AppUtils.hasRole(userDetails, "DOCTOR")) {
      return consultationService.getDoctorsConsultationByStatus(status, userDetails.getId()).size();
    }
    return consultationService.getAllConsultationsByStatus(status).size();
  }

  /**
   * Retrieves the total completed consultation time per doctor.
   *
   * @return The total completed consultation time per doctor.
   */
  public List<TotalCompletedConsultationTimePerDoctorDTO> getTotalCompletedConsultationTimePerDoctor() {
    List<TotalCompletedConsultationTimePerDoctorDTO> totalCompletedConsultationTimePerDoctorDTOS =
        new LinkedList<>();

    Map<Long, Long> completedConsultationTimes = new HashMap<>();

    List<Consultation> consultations =
        consultationService.getAllConsultationsByStatus(EConsultationStatus.finished);

    for (Consultation consultation : consultations) {
      if (consultation.getTimeStarted() != null && consultation.getTimeFinished() != null) {

        Long timeFinished = consultation.getTimeFinished()
            .atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

        Long timeStarted = consultation.getTimeStarted()
            .atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

        completedConsultationTimes.merge(consultation.getDoctorId(),
            (timeFinished - timeStarted),
            Long::sum);
      }
    }

    for (Map.Entry<Long, Long> set : completedConsultationTimes.entrySet()) {
      Doctor doctor = doctorService.getByUserId(set.getKey());

      long totalTime = set.getValue();
      long milliSeconds = totalTime % 1000;
      totalTime = ((totalTime - milliSeconds) / 1000);
      long seconds = totalTime % 60;
      totalTime = (totalTime - seconds) / 60;
      long minutes = totalTime % 60;
      totalTime = (totalTime - minutes) / 60;
      long hours = totalTime % 24;
      totalTime = (totalTime - hours) / 24;
      long days = totalTime;

      totalCompletedConsultationTimePerDoctorDTOS.add(
          new TotalCompletedConsultationTimePerDoctorDTO(
              doctor.getUserId(),
              doctor.getWorkEmail(),
              doctor.getFirstName(),
              doctor.getLastName(),
              days,
              hours,
              minutes,
              seconds,
              milliSeconds
          )
      );

    }

    return totalCompletedConsultationTimePerDoctorDTOS;
  }

  /**
   * Retrieves the consultations gender distribution.
   *
   * @return The consultations gender distribution
   */
  public List<ConsultationsGenderDistributionDTO> getConsultationsGenderDistribution() {
    List<ConsultationsGenderDistributionDTO> consultationsGenderDistributionDTOS =
        new LinkedList<>();

    List<Consultation> consultations = consultationService.getAllConsultations();

    Map<String, Integer> genderQuantities = new HashMap<>();

    int numberOfConsultations = consultations.size();

    if (numberOfConsultations > 0) {
      for (Consultation consultation : consultations) {
        Patient patient = patientService.getPatientByUserId(consultation.getPatientId());

        genderQuantities.merge(patient.getPolygenic().getGender(), 1, Integer::sum);
      }
    }

    if (numberOfConsultations > 0) {
      for (Map.Entry<String, Integer> genderQuantity : genderQuantities.entrySet()) {
        consultationsGenderDistributionDTOS.add(
            new ConsultationsGenderDistributionDTO(
                genderQuantity.getKey(),
                genderQuantity.getValue(),
                (double) genderQuantity.getValue() / numberOfConsultations
            )
        );
      }
    }

    return consultationsGenderDistributionDTOS;
  }

  /**
   * Retrieve the amount paid for consultations over a period of time and for a given period type, meaning years,
   * months, weeks, days or hours.
   *
   * @param startDate The start date of the period
   * @param endDate   The end date of the period
   * @param period    The period type
   * @return The amount paid per period type in the given period
   */
  public List<AmountPaidForPeriodDTO> getAmountPaidForConsultations(
      LocalDateTime startDate, LocalDateTime endDate, EPeriod period) {
    List<AmountPaidForPeriodDTO> amountPaidForPeriodDTOS = new ArrayList<>();

    List<Consultation> consultations =
        consultationService.getAllConsultationsByTimeBookedBetween(
            startDate,
            endDate
        );

    if (consultations.size() > 0) {
      DateTimeFormatter dateTimeFormatter;
      switch (period) {
        case Year:
          dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy");
          break;
        case Month:
          dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM");
          break;
        case Week:
          dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-Www");
          break;
        case Day:
          dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
          break;
        default:
          dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH");
      }

      Map<String, Double> yearlyPayments = new HashMap<>();

      for (Consultation consultation : consultations) {
        LocalDateTime timeBooked = LocalDateTime.ofInstant(
            Instant.ofEpochMilli(
                consultation.getTimeBooked().atZone(ZoneId.systemDefault())
                    .toInstant().toEpochMilli()),
            ZoneOffset.UTC);
        try {
          Double amountPaid = Double.parseDouble(consultation.getAmountPaid());
          yearlyPayments.merge(
              timeBooked.format(dateTimeFormatter),
              amountPaid, Double::sum);

        } catch (NumberFormatException ignored) {
        }
      }

      for (Map.Entry<String, Double> yearlyPayment : yearlyPayments.entrySet()) {
        amountPaidForPeriodDTOS.add(
            new AmountPaidForPeriodDTO(
                yearlyPayment.getKey(),
                yearlyPayment.getValue()
            )
        );
      }
      return amountPaidForPeriodDTOS;
    }
    return new ArrayList<>();
  }

  /**
   * Retrieves the number of consultations for different age spans.
   * <p>
   * The age spans is calculated from the supplied ages in the way that the n:th index constitutes the starting age in a
   * span, in an inclusive way, while the n:th + 1 index constitutes the final age in the same span, in a non-inclusive
   * way.
   * <p>
   * The age zero need never be specified because it is specified automatically.
   *
   * @param ages The ages
   * @return The number of consultations by age span
   */
  public List<NumberOfConsultationsByAgeSpanResponseDTO> getConsultationTotalsByAgeSpans(
      Integer[] ages) {

    ArrayList<Integer> copiedAges = new ArrayList<>();
    copiedAges.add(0);

    for (Integer age : ages) {
      if (!copiedAges.contains(age)) {
        copiedAges.add(age);
      }
    }

    List<Integer> sortedAges = copiedAges.stream().sorted().collect(Collectors.toList());

    Map<String, Integer> numberOfConsultationsByAgeSpans = new HashMap<>();

    List<Consultation> consultations = consultationService.getAllConsultations();

    if (consultations.size() > 0) {
      for (Consultation consultation : consultations) {
        Patient patient = patientService.getPatientByUserId(consultation.getPatientId());

        int age = getAgeOfPatient(patient);

        for (int i = 0; i < sortedAges.size() - 1; i++) {
          if (age >= sortedAges.get(i) && age < sortedAges.get(i + 1)) {
            numberOfConsultationsByAgeSpans.merge(
                sortedAges.get(i) + "-" + (sortedAges.get(i + 1) - 1),
                1, Integer::sum);
          } else {
            numberOfConsultationsByAgeSpans.merge(
                sortedAges.get(i) + "-" + (sortedAges.get(i + 1) - 1),
                0, Integer::sum);
          }
        }
      }
    }

    List<NumberOfConsultationsByAgeSpanResponseDTO> numberOfConsultationsByAgeSpanResponseDTOS =
        new ArrayList<>();

    for (Map.Entry<String, Integer> set : numberOfConsultationsByAgeSpans.entrySet()) {
      numberOfConsultationsByAgeSpanResponseDTOS.add(
          new NumberOfConsultationsByAgeSpanResponseDTO(
              set.getKey(),
              set.getValue()
          )
      );
    }

    return numberOfConsultationsByAgeSpanResponseDTOS;
  }

  /**
   * Retrieves the number of consultations for different genders.
   *
   * @return The object containing information about illness and gender
   */
  public List<RelationshipDTO.IllnessAndGender> getRelationshipIllnessAndGender() {
    List<Prescription> prescriptions = prescriptionService.getAllPrescriptions();
    List<RelationshipDTO.IllnessAndGender> illnessGenderRelationships = new ArrayList<>();
    Map<String, Map<String, Long>> illnessGenderCount = new HashMap<>();

    for (Prescription prescription : prescriptions) {
      String illness;
      String gender;

      try {
        illness = prescription.getIllness();
        gender = patientService.getPatientByUserId(prescription.getPatientId()).getPolygenic()
            .getGender();

        if (gender == null) {
          continue;
        }
      } catch (NullPointerException e) {
        continue;
      }

      if (!illnessGenderCount.containsKey(illness)) {
        illnessGenderCount.put(illness, new HashMap<>());
      }

      if (illnessGenderCount.get(illness).containsKey(gender)) {
        illnessGenderCount.get(illness)
            .put(gender, illnessGenderCount.get(illness).get(gender) + 1);
      } else {
        illnessGenderCount.get(illness).put(gender, 1L);
      }
    }

    for (Map.Entry<String, Map<String, Long>> set : illnessGenderCount.entrySet()) {
      illnessGenderRelationships.add(
          new RelationshipDTO.IllnessAndGender(set.getKey(), set.getValue()));
    }

    return illnessGenderRelationships;
  }

  /**
   * Retrieves the number of consultations for different age spans.
   *
   * @return The object containing information about illness and age
   */
  public List<RelationshipDTO.IllnessAndAge> getRelationshipIllnessAndAge() {
    List<Prescription> prescriptions = prescriptionService.getAllPrescriptions();
    List<RelationshipDTO.IllnessAndAge> illnessAgeRelationships = new ArrayList<>();
    Map<String, Map<String, Long>> illnessAgeCount = new HashMap<>();

    for (Prescription prescription : prescriptions) {
      String illness;
      String age;

      try {
        illness = prescription.getIllness();
        age = String.valueOf(
            getAgeOfPatient(patientService.getPatientByUserId(prescription.getPatientId())));
      } catch (NullPointerException e) {
        continue;
      }

      if (!illnessAgeCount.containsKey(illness)) {
        illnessAgeCount.put(illness, new HashMap<>());
      }

      if (illnessAgeCount.get(illness).containsKey(age)) {
        illnessAgeCount.get(illness).put(age, illnessAgeCount.get(illness).get(age) + 1);
      } else {
        illnessAgeCount.get(illness).put(age, 1L);
      }
    }

    for (Map.Entry<String, Map<String, Long>> set : illnessAgeCount.entrySet()) {
      illnessAgeRelationships.add(
          new RelationshipDTO.IllnessAndAge(set.getKey(), set.getValue()));
    }

    return illnessAgeRelationships;
  }

  /**
   * Retrieves the number of consultations for different time spans.
   *
   * @return The object containing information about illness and time of the day
   */
  public List<RelationshipDTO.IllnessAndTime> getRelationshipIllnessAndTime() {
    List<Prescription> prescriptions = prescriptionService.getAllPrescriptions();
    List<RelationshipDTO.IllnessAndTime> illnessTimeRelationships = new ArrayList<>();
    Map<String, Map<String, Long>> illnessTimeCount = new HashMap<>();

    for (Prescription prescription : prescriptions) {
      String timeInterval;
      String illness;

      try {
        if (prescription.getConsultationId() == null) {
          continue;
        }

        Consultation consultation = consultationService.getConsultation(
            prescription.getConsultationId());

        LocalDateTime timeBooked = LocalDateTime.ofInstant(Instant.ofEpochMilli(
                consultation.getTimeBooked().
                    atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()),
            ZoneOffset.UTC);
        timeInterval = timeBooked.getHour() + " - " + (timeBooked.getHour() + 1);

        illness = prescription.getIllness();
      } catch (NullPointerException | IllegalArgumentException | ResponseStatusException e) {
        continue;
      }

      if (!illnessTimeCount.containsKey(illness)) {
        illnessTimeCount.put(illness, new HashMap<>());
      }

      if (illnessTimeCount.get(illness).containsKey(timeInterval)) {
        illnessTimeCount.get(illness)
            .put(timeInterval, illnessTimeCount.get(illness).get(timeInterval) + 1);
      } else {
        illnessTimeCount.get(illness).put(timeInterval, 1L);
      }
    }

    for (Map.Entry<String, Map<String, Long>> set : illnessTimeCount.entrySet()) {
      illnessTimeRelationships.add(
          new RelationshipDTO.IllnessAndTime(set.getKey(), set.getValue()));
    }

    return illnessTimeRelationships;
  }

  /**
   * Retrieves the finished consultations rating distribution.
   *
   * @return The finished consultations rating distribution
   */
  public List<FinishedConsultationsRatingDistributionDTO>
  getFinishedConsultationsRatingDistribution() {
    List<FinishedConsultationsRatingDistributionDTO> finishedConsultationsRatingRelationships =
        new ArrayList<>();

    List<Consultation> finishedConsultations =
        consultationService.getAllConsultationsByStatus(EConsultationStatus.finished);

    Map<String, Integer> ratingQuantities = new HashMap<>();

    int numberOfConsultations = finishedConsultations.size();

    if (numberOfConsultations > 0) {
      for (Consultation consultation : finishedConsultations) {
        Integer rating = consultation.getRating();
        ratingQuantities.merge(String.valueOf(rating), 1, Integer::sum);
      }
    }

    if (numberOfConsultations > 0) {
      for (Map.Entry<String, Integer> ratingQuantity : ratingQuantities.entrySet()) {
        finishedConsultationsRatingRelationships.add(
            new FinishedConsultationsRatingDistributionDTO(
                ratingQuantity.getKey(),
                ratingQuantity.getValue(),
                (double) ratingQuantity.getValue() / numberOfConsultations
            )
        );
      }
    }

    return finishedConsultationsRatingRelationships;
  }

  public void addAccountNumberToDoctor(Long doctorId, AccountNumberDTO accountNumberDTO)
      throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
    Doctor doctor = doctorService.getByUserId(doctorId);

    KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance("RSA");
    keyPairGen.initialize(2048);
    KeyPair pair = keyPairGen.generateKeyPair();
    PublicKey publicKey = pair.getPublic();
    Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
    cipher.init(Cipher.ENCRYPT_MODE, publicKey);
    byte[] input = accountNumberDTO.getAccountNumber().getBytes();
    cipher.update(input);
    byte[] cipherText = cipher.doFinal();

    doctor.setAccountNumber(new String(cipherText));

    Wallet wallet = walletService.getWalletByPatientId(doctorId);
    wallet.setBankCode(accountNumberDTO.getBankCode());

    walletService.saveWallet(wallet);
    doctorService.saveDoctor(doctor);
  }
}