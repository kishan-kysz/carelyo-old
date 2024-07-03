package com.carelyo.v1.controllers.child;

import com.carelyo.v1.dto.child.ChildRequestDTO;
import com.carelyo.v1.dto.child.ChildResponseDTO;
import com.carelyo.v1.dto.child.UpdateChildRequestDTO;
import com.carelyo.v1.dto.child.UpdateChildStatusRequestDTO;
import com.carelyo.v1.dto.vitals.VitalsDTO;
import com.carelyo.v1.service.child.ChildService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.vitals.VitalsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import javax.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Tag(name = "Child")
@RequestMapping("/api/v1/child")
public class ChildController {

  private final ChildService childService;
  private final VitalsService vitalsService;

  public ChildController(ChildService childService, VitalsService vitalsService) {
    this.childService = childService;
    this.vitalsService = vitalsService;
  }

  @Operation(summary = "Create a child (Must be logged in as patient)")
  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @PreAuthorize("hasAuthority('PATIENT')")
  public ResponseEntity<ChildResponseDTO> createChild(
      @RequestParam("birthCertificate") MultipartFile birthCertificate,
      @RequestParam(name = "NINCard", required = false) MultipartFile NINCard,
      @Valid @ModelAttribute ChildRequestDTO childRequestDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    childRequestDTO.setBirthCertificate(birthCertificate);
    if(NINCard != null) {
      childRequestDTO.setNinCardFileName(NINCard.getOriginalFilename());
    }
    childRequestDTO.setNINCard(NINCard);
    childRequestDTO.setBirthCertFileName(birthCertificate.getOriginalFilename());
    return ResponseEntity.ok(childService.createChild(childRequestDTO, userDetails));
  }

  @Operation(summary = "Get Children info from patient", description = "**Role:** `SYSTEMADMIN` or PATIENT")
  @GetMapping
  @PreAuthorize("hasAuthority('SYSTEMADMIN') or hasAuthority('PATIENT')")
  public ResponseEntity<List<ChildResponseDTO>> getChildren(
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.ok(childService.getChildren(userDetails, false));
  }

  @Operation(summary = "Get Active Children info from patient", description = "**Role:** `SYSTEMADMIN` or PATIENT")
  @GetMapping("/active")
  @PreAuthorize("hasAuthority('SYSTEMADMIN') or hasAuthority('PATIENT')")
  public ResponseEntity<List<ChildResponseDTO>> getActiveChildren(
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.ok(childService.getChildren(userDetails, true));
  }

  @Operation(summary = "Get Child info by id from patient", description = "**Role:** `SYSTEMADMIN` or PATIENT")
  @GetMapping("{childId}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN') or hasAuthority('PATIENT')")
  public ResponseEntity<ChildResponseDTO> getChildById(@PathVariable("childId") Long childId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.ok(childService.getChildById(childId, userDetails));
  }

  @Operation(summary = "Get Child vitals info by id from patient", description = "**Role:** `SYSTEMADMIN` or PATIENT")
  @GetMapping("vitals/{userId}/{childId}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN') or hasAuthority('PATIENT')")
  public ResponseEntity<VitalsDTO> getChildVitalsById(@PathVariable("userId") Long userId,
      @PathVariable("childId") Long childId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.ok(
        vitalsService.getVitalsByUserIdAndChildId(userId, childId, userDetails));
  }

  @Operation(summary = "Update Child info from patient", description = "**Role:** `SYSTEMADMIN` or PATIENT")
  @PutMapping
  @PreAuthorize("hasAuthority('SYSTEMADMIN') or hasAuthority('PATIENT')")
  public ResponseEntity<String> updateChild(
      @Valid @RequestBody UpdateChildRequestDTO updateChildRequestDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    childService.updateChild(updateChildRequestDTO, userDetails);
    return ResponseEntity.ok("Child updated successfully");
  }

  @Operation(summary = "Update Child status from patient", description = "**Role:** `SYSTEMADMIN` or PATIENT")
  @PutMapping("/status")
  @PreAuthorize("hasAuthority('SYSTEMADMIN') or hasAuthority('PATIENT')")
  public ResponseEntity<String> updateChildStatus(
      @RequestBody UpdateChildStatusRequestDTO updateChildStatusRequestDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    childService.updateChidStatus(updateChildStatusRequestDTO, userDetails);
    return ResponseEntity.ok("Child status updated successfully");
  }

}
