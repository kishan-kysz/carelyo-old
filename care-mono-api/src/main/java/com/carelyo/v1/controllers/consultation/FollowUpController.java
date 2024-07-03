package com.carelyo.v1.controllers.consultation;

import com.carelyo.v1.dto.doctor.CalendarDTO.Create;
import com.carelyo.v1.dto.summary.FollowUpDTO;
import com.carelyo.v1.model.consultation.Consultation;
import com.carelyo.v1.model.summary.FollowUp;
import com.carelyo.v1.service.consultation.ConsultationService;
import com.carelyo.v1.service.consultation.FollowUpService;
import com.carelyo.v1.service.doctor.CalendarService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.utils.AppUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@Tag(name = "FollowUp")
// @Slf4j

@RequestMapping("/api/v1/consultations/followup")
public class FollowUpController {

  private final FollowUpService followUpService;
  private final CalendarService calendarService;
  private final ConsultationService consultationService;

  public FollowUpController(FollowUpService followUpService,
      CalendarService calendarService, ConsultationService consultationService) {
    this.followUpService = followUpService;

    this.calendarService = calendarService;
    this.consultationService = consultationService;
  }

  @Operation(summary = "Get all follow up", description = "**Role:** `SYSTEMADMIN`")
  @GetMapping
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<FollowUpDTO>> getAllFollowUp() {
    return ResponseEntity.ok()
        .body(followUpService.getAllFollowUp()
            .stream()
            .map(FollowUp::getFullDTO)
            .collect(Collectors.toList()));
  }

  @Operation(summary = "Post a follow up", description = "**Role:** `DOCTOR`")
  @PostMapping("/create")
  @PreAuthorize("hasAuthority('DOCTOR')")
  public ResponseEntity<FollowUpDTO> postFollowUpForm(
      @Valid @RequestBody FollowUpDTO.NewFollowUpDTO followUpFormDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {

    FollowUpDTO followUpDTO = followUpService.createFollowUp(followUpFormDTO)
        .getFullDTO();

    Consultation consultation = consultationService.getConsultation(
        followUpFormDTO.getConsultationId());
    String patientName = consultation.getPatientFullName();

    Create calendarDTO = new Create(
        followUpFormDTO.getFollowUpDate(),
        followUpFormDTO.getFollowUpDate().plusHours(2),
        "Follow up with" + " " + patientName,
        followUpFormDTO.getPurpose(),
        followUpFormDTO.getLocation(),
        AppUtils.getRandomHexColor(),
        false,
        false,
        true,
        consultation.isChild()  ? consultation.getChildId() : null);
    calendarService.createCalendarEntry(calendarDTO, userDetails.getId());

    return ResponseEntity.ok().body(followUpDTO);
  }

  @Operation(summary = "Update a follow up", description = "**Role:** `DOCTOR`")
  @PutMapping("/update")
  @PreAuthorize("hasAuthority('DOCTOR')")
  public ResponseEntity<FollowUpDTO> updateFollowUp(
      @Valid @RequestBody FollowUpDTO.UpdateFollowUpDTO followUpDTO) {
    return ResponseEntity.ok().body(followUpService.updateFollowUp(followUpDTO).getFullDTO());
  }

  @Operation(summary = "Delete follow up", description = "**Role:** 'Doctor'")
  @DeleteMapping("/delete/{id}")
  @PreAuthorize("hasAuthority('DOCTOR')")
  public ResponseEntity<String> deleteFollowUp(@PathVariable("id") Long id,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    followUpService.deleteFollowUp(id, userDetails.getId());
    return ResponseEntity.ok().body("Follow up has been deleted");
  }

}
