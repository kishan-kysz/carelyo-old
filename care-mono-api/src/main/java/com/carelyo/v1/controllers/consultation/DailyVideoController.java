package com.carelyo.v1.controllers.consultation;

import com.carelyo.v1.model.consultation.Consultation;
import com.carelyo.v1.service.consultation.ConsultationService;
import com.carelyo.v1.service.external.DailyVideoService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Consultations")
@RequestMapping("/api/v1/consultations")
public class DailyVideoController {

  private final DailyVideoService dailyVideoService;
  private final ConsultationService consultationService;

  public DailyVideoController(DailyVideoService dailyVideoService,
      ConsultationService consultationService) {
    this.dailyVideoService = dailyVideoService;
    this.consultationService = consultationService;
  }

  @GetMapping("/video-token/{consultationId}")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('DOCTOR')")
  public ResponseEntity<String> getAccessToken(
      @PathVariable("consultationId") Long consultationId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long userId = userDetails.getId();
    Consultation consultation = consultationService.getConsultation(consultationId);
    String roomName = consultation.getRoomName();
    if (roomName == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body("{\"status\": \"error\", \"message\": \"Invalid Consultation State\"}");
    }
    if (consultation.getPatientId().equals(userId)) {
      return ResponseEntity.status(HttpStatus.OK)
          .body(dailyVideoService.getAccessToken(roomName,
              consultation.getPatientFullName(), userId,
              600000, false));
    } else if (consultation.getDoctorId().equals(userId)) {
      return ResponseEntity.status(HttpStatus.OK)
          .body(dailyVideoService.getAccessToken(roomName,
              consultation.getDoctorFullName(), userId,
              0, true));
    } else {
      return ResponseEntity.status(HttpStatus.FORBIDDEN)
          .header("Content-type", "application/json")
          .body("{\"status\": \"error\",\"\"message\":\"\"You are not allowed to access this room\"}");
    }
  }

}
