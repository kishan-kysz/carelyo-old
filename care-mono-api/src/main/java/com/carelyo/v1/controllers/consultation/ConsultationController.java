package com.carelyo.v1.controllers.consultation;

import com.carelyo.v1.dto.PaymentVerificationDTO;
import com.carelyo.v1.dto.consultation.ConsultationDTO;
import com.carelyo.v1.dto.consultation.ConsultationDTO.AcceptConsultationResponse;
import com.carelyo.v1.dto.consultation.ConsultationDTO.BookedConsultation;
import com.carelyo.v1.dto.consultation.ConsultationDTO.BookedConsultationForChild;
import com.carelyo.v1.dto.consultation.ConsultationDTO.ConsultationResponse;
import com.carelyo.v1.dto.consultation.DailyVideoDTO;
import com.carelyo.v1.dto.consultation.PaystackDTO;
import com.carelyo.v1.dto.summary.ConsultationSummaryDTO;
import com.carelyo.v1.model.consultation.Consultation;
import com.carelyo.v1.model.payment.PriceList;
import com.carelyo.v1.model.user.child.Child;
import com.carelyo.v1.model.user.patient.Patient;
import com.carelyo.v1.service.child.ChildService;
import com.carelyo.v1.service.consultation.BookingService;
import com.carelyo.v1.service.consultation.ConsultationService;
import com.carelyo.v1.service.consultation.SummaryService;
import com.carelyo.v1.service.consultation.SummaryService.CurrentSummary;
import com.carelyo.v1.service.external.DailyVideoService;
import com.carelyo.v1.service.external.PaymentService;
import com.carelyo.v1.service.external.PaystackService;
import com.carelyo.v1.service.invitation.InvitationService;
import com.carelyo.v1.service.patient.PatientService;
import com.carelyo.v1.service.payout.PayoutService;
import com.carelyo.v1.service.pricelist.PriceListService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.utils.AppUtils;
import com.carelyo.v1.utils.ConsultationDTOUtil;
import com.carelyo.v1.utils.enums.EInvitation;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/consultations")
public class ConsultationController {

  private final ConsultationService consultationService;
  private final BookingService bookingService;
  private final PaystackService paystackService;
  private final SummaryService summaryService;
  private final PaymentService paymentService;
  private final PatientService patientService;
  private final InvitationService invitationService;
  private final PayoutService payoutService;
  private final PriceListService priceListService;
  private final DailyVideoService dailyVideoService;
  private final ChildService childService;

  public ConsultationController(ConsultationService consultationService,
      BookingService bookingService, PaystackService paystackService,
      SummaryService summaryService, PatientService patientService,
      InvitationService invitationService, PayoutService payoutService,
      PriceListService priceListService, DailyVideoService dailyVideoService, PaymentService paymentService,
      ChildService childService) {
    this.consultationService = consultationService;
    this.bookingService = bookingService;
    this.paystackService = paystackService;
    this.summaryService = summaryService;
    this.patientService = patientService;
    this.invitationService = invitationService;
    this.payoutService = payoutService;
    this.priceListService = priceListService;
    this.dailyVideoService = dailyVideoService;
    this.paymentService = paymentService;
    this.childService = childService;
  }

  @Tag(name = "Booking", description = "**Role:** `SYSTEMADMIN` `PATIENT`")
  @Operation(summary = "Creates a new booking entry", description = "**Role:** `PATIENT` Also initializes a payment with paystack")
  @PostMapping("/create")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<BookedConsultation> initializeTransactionForBooking(
      @Valid @RequestBody ConsultationDTO.InitializeTransactionRequest initializeTransactionRequestDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    if (consultationService.getActiveConsultationPatient(userDetails.getId()) != null) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You have an active paid consultation");
    }

    consultationService.abandonPreviousBooking(userDetails.getId());

    PaystackDTO.Data paystackResponse = paymentService.initPayment(
        initializeTransactionRequestDTO.getAmountPaid(), userDetails);

    String priceListName = initializeTransactionRequestDTO.getPriceListName() != null &&
        !initializeTransactionRequestDTO.getPriceListName().isEmpty()
            ? initializeTransactionRequestDTO.getPriceListName()
            : "consultation";

    PriceList priceList = priceListService.getPriceListById(priceListName);
    Map<String, Double> dto = priceList.getPrices();

    Consultation consultation = bookingService.createBooking(
        priceList.getName(),
        userDetails.getId(),
        paystackResponse.getAuthorization_url(),
        paystackResponse.getReference(),
        initializeTransactionRequestDTO,
        dto.get("duration"));
    consultation.setClientSecret(paystackResponse.getClientSecret());
    consultation.setPaymentProvider(paystackResponse.getPaymentProvider());
    return ResponseEntity.status(HttpStatus.OK).body(new ConsultationDTO.BookedConsultation(
        consultation.getId(),
        consultation.getStatus(),
        consultation.getTimeBooked(),
        consultation.getTransactionReference(),
        consultation.getTransactionUrl(),
        consultation.getClientSecret(),
        consultation.getPaymentProvider(),
        consultation.getDuration()));
  }

  @Tag(name = "Booking", description = "**Role:** `DOCTOR` `PATIENT`")
  @Operation(summary = "Verify a payment", description = "**Role:** `PATIENT`")
  @PostMapping("/verify-payment")
  @PreAuthorize("hasAuthority('SYSTEMADMIN') or hasAuthority('PATIENT')")
  public ResponseEntity<String> verifyPayments(@RequestBody PaymentVerificationDTO paymentVerification,
      @AuthenticationPrincipal UserDetailsImpl userDetails) throws InterruptedException {
    String response = paymentService.verifyPayment(paymentVerification, userDetails);

    if (response.equals("success")) {
      invitationService.updateInvitationStatus(userDetails.getEmail(), EInvitation.booked);
      Consultation consultation = bookingService.finishBooking(
          paymentVerification.getReferenceId(),
          userDetails);

      payoutService.initPayOut(consultation);
      return ResponseEntity.status(HttpStatus.OK)
          .body("{\"status\": \"success\", \"message\": \"Payment successful\"}");
    }
    bookingService.sendToPatientPaymentFailed(userDetails.getEmail(), userDetails.getId());
    return ResponseEntity.status(HttpStatus.OK).body("{ \"status\": \"" + response + "\"}");
  }

  @Tag(name = "Booking", description = "**Role:** `DOCTOR` `PATIENT`")
  @Operation(summary = "Update a booking for consultation", description = "Patient can update a booking for consultation, But only if the booking is not yet confirmed by the doctor")
  @PutMapping("/update/{consultationId}")
  @PreAuthorize("hasAuthority('PATIENT')")
  public ResponseEntity<ConsultationResponse> updateBooking(
      @PathVariable("consultationId") Long id,
      @Valid @RequestBody ConsultationDTO.UpdateActiveConsultation updateConsultation,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.status(HttpStatus.OK).body(ConsultationDTOUtil.getResponseDTO(
        bookingService.updateBooking(id, updateConsultation, userDetails.getId())));
  }

  @Tag(name = "Booking", description = "**Role:** `DOCTOR` `PATIENT`")
  @Operation(summary = "Accept consultation as a doctor", description = "**Role:** `DOCTOR`")
  @PutMapping("/accept/{consultationId}")
  @PreAuthorize("hasAuthority('DOCTOR')")
  public ResponseEntity<AcceptConsultationResponse> acceptConsultation(
      @PathVariable("consultationId") Long id,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Consultation acceptedConsultation = bookingService.acceptConsultation(id,
        userDetails.getId());
    if (acceptedConsultation.getConsultationUrl() == null
        || acceptedConsultation.getRoomName() == null) {
      // Create a new video room on daily.co and save the room url to the database
      DailyVideoDTO.RoomResponse videoRoom = dailyVideoService.createRoom(
          acceptedConsultation.getDuration());
      acceptedConsultation.setConsultationUrl(videoRoom.getUrl());
      acceptedConsultation.setRoomName(videoRoom.getName());
      consultationService.save(acceptedConsultation);
    }

    return ResponseEntity.ok()
        .body(new AcceptConsultationResponse(acceptedConsultation.getId(),
            acceptedConsultation.getRoomName(),
            acceptedConsultation.getConsultationType(),
            acceptedConsultation.getPriceListName()));
  }

  @Tag(name = "Booking", description = "**Role:** `DOCTOR` `PATIENT`")
  @Operation(summary = "Start consultation", description = "**Role:** `DOCTOR`")
  @PutMapping("/start/{consultationId}")
  @PreAuthorize("hasAuthority('DOCTOR')")
  public ResponseEntity<String> startConsultation(
      @PathVariable("consultationId") Long consultationId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    bookingService.startConsultation(consultationId, userDetails);
    return ResponseEntity.ok().body("{\"message\": \"Consultation started\"}");
  }

  @Tag(name = "Booking", description = "**Role:** `DOCTOR` `PATIENT`")
  @Operation(summary = "Finish consultation", description = "**Role:** `DOCTOR`")
  @PutMapping("/complete/{consultationId}")
  @PreAuthorize("hasAuthority('DOCTOR')")
  public ResponseEntity<String> finishConsultation(
      @PathVariable("consultationId") Long consultationId,
      @Valid @RequestBody ConsultationDTO.FinishConsultation finishConsultationDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Consultation booking = bookingService.finishConsultation(consultationId,
        finishConsultationDTO,
        userDetails.getId());

    dailyVideoService.deleteRoom(booking.getRoomName());
    double balance = payoutService.addToPayRoll(booking, userDetails.getId());
    return ResponseEntity.status(HttpStatus.OK)
        .header("Content-Type", "application/json")
        .body("{\"message\": \"Consultation completed\", \"balance\": " + balance + "\"}");
  }

  @Tag(name = "Consultations", description = "**Role:** `SYSTEMADMIN` `DOCTOR` `PATIENT`")
  @Operation(summary = "Get a specific consultation", description = "**Role:** `DOCTOR` `PATIENT` `SYSTEMADMIN`")
  @GetMapping("/{consultationId}")
  @PreAuthorize("hasAuthority('DOCTOR') or hasAuthority('PATIENT') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<ConsultationDTO.ConsultationResponse> getConsultation(
      @PathVariable("consultationId") Long consultationId) {
    // TODO Implement userdetails
    Consultation consultation = consultationService.getConsultation(consultationId);
    return ResponseEntity.status(HttpStatus.OK).body(
        ConsultationDTOUtil.getResponseDTO(consultation));
  }

  @Tag(name = "Consultations", description = "**Role:** `DOCTOR`")
  @Operation(summary = "Get all booked consultations", description = "Fetches all consultations that have been booked by a patient **Role:** `DOCTOR`  `SYSTEMADMIN`")
  @GetMapping("/booked")
  @PreAuthorize("hasAuthority('DOCTOR') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<ConsultationDTO.BookedConsultationResponse>> getAllBookedConsultations() {
    return ResponseEntity.ok().body(consultationService.getAllBookedConsultations());
  }

  @Tag(name = "Consultations", description = "**Role:** `DOCTOR`")
  @Operation(summary = "Get all accepted consultations", description = "**Role:** `DOCTOR` `SYSTEMADMIN`")
  @GetMapping("/doctors/accepted/{doctorId}")
  @PreAuthorize("hasAuthority('DOCTOR') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<ConsultationDTO.ConsultationResponse>> getAllAcceptedConsultations(
      @PathVariable("doctorId") Long doctorId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long targetDoctorId = AppUtils.enforceTargetIfAdmin(doctorId, userDetails);
    return ResponseEntity.ok()
        .body(consultationService.getAllAcceptedConsultations(targetDoctorId)
            .stream().map(ConsultationDTOUtil::getResponseDTO)
            .collect(Collectors.toList()));
  }

  @Tag(name = "Consultations", description = "**Role:** `PATIENT`")
  @Operation(summary = "Get finished consultations for a specific patient", description = "**Role:** `DOCTOR` `PATIENT` `SYSTEMADMIN`")
  @GetMapping("/patients/completed/{patientId}")
  @PreAuthorize("hasAuthority('DOCTOR') or hasAuthority('PATIENT') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<ConsultationDTO.FinishedConsultation>> getFinishedConsultationsByPatientId(
      @PathVariable("patientId") Long patientId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.ok()
        .body(consultationService.getFinishedConsultationsByPatientId(patientId,
            userDetails).stream()
            .map(ConsultationDTOUtil::getFinishedConsultationDTO)
            .collect(Collectors.toList()));
  }

  @Tag(name = "Consultations", description = "**Role:** `DOCTOR` `PATIENT` `SYSTEMADMIN`")
  @Operation(summary = "Get accepted consultation", description = "**Role:** `DOCTOR`")
  @GetMapping("/accepted/{roomName}")
  @PreAuthorize("hasAuthority('DOCTOR') or hasAuthority('PATIENT')")
  public ResponseEntity<ConsultationDTO.AcceptedConsultation> getAcceptedConsultation(
      @PathVariable("roomName") String roomName,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Consultation consultation = consultationService.getActiveConsultation(roomName,
        userDetails.getId());
    if(consultation.isChild()) {
      Child child = childService.getChildById(consultation.getChildId()).orElse(null);
      Patient patient = patientService.getPatientByUserId(child.getPatient().getUserId());
      List<ConsultationSummaryDTO> summaries = summaryService.getAllConsultationSummaryByPatientId(
          consultation.getPatientId(), consultation.isChild(), consultation.getChildId());
      CurrentSummary currentSummary = summaryService.getCurrentSummary(consultation.getId());

      return ResponseEntity.status(HttpStatus.OK).body(
          ConsultationDTOUtil.createAcceptedChildDTO(
              consultation,
              patient,
              child,
              summaries,
              currentSummary,
              consultationService.getImagesUrls(consultation.getId())));
    } else {
      Patient patient = patientService.getPatientByUserId(consultation.getPatientId());
      List<ConsultationSummaryDTO> summaries = summaryService.getAllConsultationSummaryByPatientId(
          consultation.getPatientId(), consultation.isChild(), null);
      CurrentSummary currentSummary = summaryService.getCurrentSummary(consultation.getId());

      return ResponseEntity.status(HttpStatus.OK).body(
          ConsultationDTOUtil.createAcceptedDTO(
              consultation,
              patient,
              summaries,
              currentSummary,
              consultationService.getImagesUrls(consultation.getId())));
    }
  }

  @Tag(name = "Booking", description = "**Role:** `DOCTOR` `SYSTEMADMIN`")
  @Operation(summary = "List of images URLs for booking")
  @GetMapping(path = "/images/{consultationId}")
  @PreAuthorize("hasAuthority('DOCTOR') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<String>> getImagesUrls(
      @PathVariable("consultationId") Long consultationId) {
    return ResponseEntity.ok(consultationService.getImagesUrls(consultationId));
  }

  @Tag(name = "Booking", description = "**Role:** `PATIENT`")
  @Operation(summary = "Rate a consultation", description = "**Role:** `PATIENT`")
  @PutMapping("/rate")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<String> rateConsultation(
      @RequestParam("consultationId") Long consultationId,
      @Valid @RequestParam("rating") @Min(value = 1, message = "Rating cannot be less than one") @Max(value = 5, message = "Rating cannot be higher than 5") int rating,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    bookingService.rateConsultation(consultationId, rating, userDetails);
    return ResponseEntity.status(HttpStatus.OK)
        .header("Content-Type", "application/json")
        .body("{\"message\": \"Consultation rated\"}");
  }

  @Tag(name = "Booking", description = "**Role:** `PATIENT` `DOCTOR` `SYSTEMADMIN`")
  @Operation(summary = "Cancel a consultation - response double wallet balance.", description = "**Role:** `PATIENT` `DOCTOR` `SYSTEMADMIN`")
  @PutMapping("/cancel/{consultationId}")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('SYSTEMADMIN') or hasAuthority('DOCTOR')")
  public ResponseEntity<Double> cancelConsultation(
      @PathVariable("consultationId") Long consultationId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.ok(
        consultationService.cancelConsultation(consultationId, userDetails));
  }

  @Tag(name = "Booking", description = "**Role:** `PATIENT`")
  @Operation(summary = "Create consultation for child.", description = "**Role:** `PATIENT`")
  @PutMapping("/create/child/consultation/{userId}")
  @PreAuthorize("hasAuthority('PATIENT')")
  public ResponseEntity<BookedConsultationForChild> createChildConsultation(
      @PathVariable Long userId,
      @Valid @RequestBody ConsultationDTO.InitializeTransactionRequest initializeTransactionRequestDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Patient parent = patientService.getPatientByUserId(userDetails.getId());
    Patient child = patientService.getPatientByUserId(userId);

    if (patientService.isChildsParent(child.getUserId(), parent.getUserId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You are not the parent of this child");
    }

    if (consultationService.getActiveConsultationPatient(child.getUserId()) != null) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You have an active paid consultation for this child");
    }

    PaystackDTO.Data paystackResponse = paymentService.initPayment (
        initializeTransactionRequestDTO.getAmountPaid(),
        userDetails);
    // Optional should be removed when implemented in frontend. and Dummy priceList
    // removed from LoadDataService.java

    String priceListName = initializeTransactionRequestDTO.getPriceListName() != null &&
        !initializeTransactionRequestDTO.getPriceListName().isEmpty()
            ? initializeTransactionRequestDTO.getPriceListName()
            : "child";

    PriceList priceList = priceListService.getPriceListById(priceListName);
    Map<String, Double> dto = priceList.getPrices();

    Consultation consultation = bookingService.createChildConsultation(priceList.getName(),
        paystackResponse.getAuthorization_url(),
        paystackResponse.getReference(),
        initializeTransactionRequestDTO,
        dto.get("duration"),
        child);

    return ResponseEntity.status(HttpStatus.OK)
        .body(new ConsultationDTO.BookedConsultationForChild(
            consultation.getId(),
            consultation.getStatus(),
            consultation.getTimeBooked(),
            consultation.getTimeAccepted(),
            consultation.getTimeStarted(),
            consultation.getTimeFinished(),
            consultation.getTransactionReference(),
            consultation.getTransactionUrl(),
            consultation.getDuration(),
            consultation.getPatientId(),
            consultation.getPatientFullName(),
            consultation.getPriceListName()));
  }

  @Tag(name = "Consultations", description = "**Role:** `PATIENT`")
  @Operation(summary = "Get all finished consultations for child")
  @GetMapping(path = "/child/consultations/{userId}")
  @PreAuthorize("hasAuthority('PATIENT')")
  public ResponseEntity<List<BookedConsultationForChild>> getAllFinishedChildConsultations(
      @PathVariable Long userId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.ok()
        .body(consultationService.getFinishedChildConsultations(userId, userDetails)
            .stream()
            .map(Consultation::getChildConsultations)
            .collect(Collectors.toList()));
  }

  @Tag(name = "Booking", description = "**Role:** `PATIENT`")
  @Operation(summary = "Retain a consultation", description = "**Role:** `PATIENT`")
  @PutMapping("/retain/{consultationId}")
  @PreAuthorize("hasAuthority('PATIENT')")
  public ResponseEntity<String> retainConsultation(
      @PathVariable("consultationId") Long consultationId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    bookingService.retainConsultation(consultationId, userDetails);
    return ResponseEntity.status(HttpStatus.OK)
        .header("Content-Type", "application/json")
        .body("{\"message\": \"Consultation retained\"}");
  }

  @Tag(name = "Consultations", description = "**Role** `DOCTOR` `SYSTEMADMIN`")
  @Operation(summary = "Get all finished consultation for a specific doctor", description = "**Role** `DOCTOR` `SYSTEMADMIN`")
  @GetMapping("/doctors/completed/{doctorId}")
  @PreAuthorize("hasAuthority('DOCTOR') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<ConsultationDTO.FinishedConsultation>> getAllFinishedConsultationByDoctorId(
      @PathVariable Long doctorId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.ok()
        .body(consultationService.getFinishedConsultationsByDoctorId(doctorId,
            userDetails).stream()
            .map(ConsultationDTOUtil::getFinishedConsultationDTO)
            .collect(Collectors.toList()));
  }
}
