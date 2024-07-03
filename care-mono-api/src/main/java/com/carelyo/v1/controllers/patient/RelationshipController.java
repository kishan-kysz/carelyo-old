package com.carelyo.v1.controllers.patient;

import com.carelyo.v1.dto.patient.PatientDTO.CreateRelationshipDTO;
import com.carelyo.v1.dto.patient.PatientDTO.UpdateRelationshipDTO;
import com.carelyo.v1.service.patient.RelationshipService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Relationship")
@RequestMapping("/api/v1/relationship")
public class RelationshipController {
  private final RelationshipService relationshipService;

  public RelationshipController(RelationshipService relationshipService) {
    this.relationshipService = relationshipService;
  }

  @Operation(summary = "Add a relationship", description = "**Role:** `PATIENT` `SYSTEMADMIN`")
  @PostMapping("/create/{userId}")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<String> createRelationship(@PathVariable Long userId,
      @RequestBody CreateRelationshipDTO createRelationshipDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    relationshipService.createRelationship(userId, createRelationshipDTO, userDetails);
    return ResponseEntity.ok().body("Relationship created successfully");
  }

  @Operation(summary = "Edit a relationship", description = "**Role:** `PATIENT` `SYSTEMADMIN`")
  @PutMapping("/update/{id}")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<String> updateRelationship(@PathVariable Long id,
      @RequestBody UpdateRelationshipDTO updateRelationshipDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    relationshipService.updateRelationship(id, updateRelationshipDTO, userDetails);
    return ResponseEntity.ok().body("Relationship updated successfully");
  }
}
