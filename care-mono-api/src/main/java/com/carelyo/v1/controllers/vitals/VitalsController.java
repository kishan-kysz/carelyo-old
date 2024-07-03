package com.carelyo.v1.controllers.vitals;

import com.carelyo.v1.dto.vitals.VitalsDTO;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.vitals.VitalsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Vitals")
@RequestMapping("/api/v1/vitals")
public class VitalsController {

  private final VitalsService vitalsService;

  public VitalsController(VitalsService vitalsService) {
    this.vitalsService = vitalsService;
  }

  @Operation(summary = "Get all vitals", description = "**Role:** `SYSTEMADMIN`")
  @GetMapping("/")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<VitalsDTO> getAllVitals() {
    return ResponseEntity.ok().body(vitalsService.getAllVitals());
  }

  @Operation(summary = "Get all user vitals", description = "**Role:** `SYSTEMADMIN` `DOCTOR` `PATIENT`")
  @GetMapping("/{userId}")
  @PreAuthorize("hasAnyAuthority('SYSTEMADMIN', 'DOCTOR', 'PATIENT')")
  public ResponseEntity<VitalsDTO> getAllUserVitals(@PathVariable("userId") Long userId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.ok().body(vitalsService.getVitalsByUserIdAndChildId(userId, null, userDetails));
  }

  @Operation(summary = "Get all child vitals", description = "**Role:** `SYSTEMADMIN` `DOCTOR` `PATIENT`")
  @GetMapping("/child/{childId}")
  @PreAuthorize("hasAnyAuthority('SYSTEMADMIN', 'DOCTOR', 'PATIENT')")
  public ResponseEntity<VitalsDTO> getAllUserVitalsAnd(@PathVariable("childId") Long childId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.ok()
        .body(vitalsService.getVitalsByUserIdAndChildId(userDetails.getId(), childId, userDetails));
  }

  @Operation(summary = "Create vitals", description = "**Role:** `SYSTEMADMIN` `DOCTOR` `PATIENT`")
  @PostMapping("/create/{userId}")
  @PreAuthorize("hasAnyAuthority('SYSTEMADMIN', 'DOCTOR', 'PATIENT')")
  public ResponseEntity<String> createVitals(@PathVariable("userId") Long userId,
      @Valid @RequestBody VitalsDTO.CreateVitals createVitalsDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long childId = null;
    if(createVitalsDTO.getChildId() != null) {
      childId = createVitalsDTO.getChildId();
    }
    vitalsService.createVitals(createVitalsDTO, userDetails, userId, childId);
    return ResponseEntity.ok().body("Vitals created successfully");
  }

  @Operation(summary = "Create vitals for child", description = "**Role:** `SYSTEMADMIN` `DOCTOR` `PATIENT`")
  @PostMapping("/create/{userId}/{childId}")
  @PreAuthorize("hasAnyAuthority('SYSTEMADMIN', 'DOCTOR', 'PATIENT')")
  public ResponseEntity<String> createVitalsForChild(@PathVariable("userId") Long userId,
      @PathVariable("childId") Long childId,
      @Valid @RequestBody VitalsDTO.CreateVitals createVitalsDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    vitalsService.createVitals(createVitalsDTO, userDetails, userId, childId);
    return ResponseEntity.ok().body("Vitals created successfully");
  }

  @Operation(summary = "Create blood glucose", description = "**Role:** `SYSTEMADMIN` `DOCTOR` `PATIENT`")
  @PostMapping("/blood-glucose/create/{userId}")
  @PreAuthorize("hasAnyAuthority('SYSTEMADMIN', 'DOCTOR', 'PATIENT')")
  public ResponseEntity<String> createBloodGlucose(@PathVariable("userId") Long userId,
      @Valid @RequestBody VitalsDTO.CreateBloodGlucose createBloodGlucoseDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    vitalsService.createBloodGlucose(createBloodGlucoseDTO, userDetails, userId, null);
    return ResponseEntity.ok().body("Blood glucose created successfully");
  }

  @Operation(summary = "Create blood oxygen", description = "**Role:** `SYSTEMADMIN` `DOCTOR` `PATIENT`")
  @PostMapping("/blood-oxygen/create/{userId}")
  @PreAuthorize("hasAnyAuthority('SYSTEMADMIN', 'DOCTOR', 'PATIENT')")
  public ResponseEntity<String> createBloodOxygen(@PathVariable("userId") Long userId,
      @Valid @RequestBody VitalsDTO.CreateBloodOxygen createBloodOxygenDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    vitalsService.createBloodOxygen(createBloodOxygenDTO, userDetails, userId, null);
    return ResponseEntity.ok().body("Blood oxygen created successfully");
  }

  @Operation(summary = "Create blood pressure", description = "**Role:** `SYSTEMADMIN` `DOCTOR` `PATIENT`")
  @PostMapping("/blood-pressure/create/{userId}")
  @PreAuthorize("hasAnyAuthority('SYSTEMADMIN', 'DOCTOR', 'PATIENT')")
  public ResponseEntity<String> createBloodPressure(@PathVariable("userId") Long userId,
      @Valid @RequestBody VitalsDTO.CreateBloodPressure createBloodPressureDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    vitalsService.createBloodPressure(createBloodPressureDTO, userDetails, userId, null);
    return ResponseEntity.ok().body("Blood pressure created successfully");
  }

  @Operation(summary = "Create body temperature", description = "**Role:** `SYSTEMADMIN` `DOCTOR` `PATIENT`")
  @PostMapping("/body-temperature/create/{userId}")
  @PreAuthorize("hasAnyAuthority('SYSTEMADMIN', 'DOCTOR', 'PATIENT')")
  public ResponseEntity<String> createBodyTemperature(@PathVariable("userId") Long userId,
      @Valid @RequestBody VitalsDTO.CreateBodyTemperature createBodyTemperatureDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    vitalsService.createBodyTemperature(createBodyTemperatureDTO, userDetails, userId, null);
    return ResponseEntity.ok().body("Body temperature created successfully");
  }

  @Operation(summary = "Create heart rate", description = "**Role:** `SYSTEMADMIN` `DOCTOR` `PATIENT`")
  @PostMapping("/heart-rate/create/{userId}")
  @PreAuthorize("hasAnyAuthority('SYSTEMADMIN', 'DOCTOR', 'PATIENT')")
  public ResponseEntity<String> createHeartRate(@PathVariable("userId") Long userId,
      @Valid @RequestBody VitalsDTO.CreateHeartRate createHeartRateDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    vitalsService.createHeartRate(createHeartRateDTO, userDetails, userId, null);
    return ResponseEntity.ok().body("Heart rate created successfully");
  }

  @Operation(summary = "Create menstruation", description = "**Role:** `SYSTEMADMIN` `DOCTOR` `PATIENT`")
  @PostMapping("/menstruation/create/{userId}")
  @PreAuthorize("hasAnyAuthority('SYSTEMADMIN', 'DOCTOR', 'PATIENT')")
  public ResponseEntity<String> createMenstruation(@PathVariable("userId") Long userId,
      @Valid @RequestBody VitalsDTO.CreateMenstruation createMenstruationDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    vitalsService.createMenstruation(createMenstruationDTO, userDetails, userId, null);
    return ResponseEntity.ok().body("Menstruation created successfully");
  }

  @Operation(summary = "Create respiratory rate", description = "**Role:** `SYSTEMADMIN` `DOCTOR` `PATIENT`")
  @PostMapping("/respiratory-rate/create/{userId}")
  @PreAuthorize("hasAnyAuthority('SYSTEMADMIN', 'DOCTOR', 'PATIENT')")
  public ResponseEntity<String> createRespiratoryRate(@PathVariable("userId") Long userId,
      @Valid @RequestBody VitalsDTO.CreateRespiratoryRate createRespiratoryRateDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    vitalsService.createRespiratoryRate(createRespiratoryRateDTO, userDetails, userId, null);
    return ResponseEntity.ok().body("Respiratory rate created successfully");
  }
}
