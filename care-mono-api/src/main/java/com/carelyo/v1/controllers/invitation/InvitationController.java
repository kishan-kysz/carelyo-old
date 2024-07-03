package com.carelyo.v1.controllers.invitation;

import com.carelyo.v1.dto.invitation.InvitationDTO.InvitationRequestDTO;
import com.carelyo.v1.dto.invitation.InvitationDTO.InvitationResponseDTO;
import com.carelyo.v1.model.invitation.Invitation;
import com.carelyo.v1.service.invitation.InvitationService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.utils.AppUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@Tag(name = "Invitation")
@RequestMapping("/api/v1/invitations")
public class InvitationController {

  private final InvitationService invitationService;

  public InvitationController(InvitationService invitationService) {
    this.invitationService = invitationService;
  }

  @Operation(summary = "Get all invitations", description = "**Role** `SYSTEMADMIN`")
  @GetMapping("/")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<Invitation>> getAllInvitations() {
    return ResponseEntity.status(HttpStatus.OK)
        .body(invitationService.getAllInvitations());
  }

  @Operation(summary = "Create Invitation", description = "**Role** `PATIENT` `DOCTOR`")
  @PostMapping("/create")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('DOCTOR') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<InvitationResponseDTO> createInvitation(
      @RequestBody InvitationRequestDTO invitationFormDTO,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Invitation invitation = invitationService.createInvitation(
        invitationFormDTO, userDetails.getId());
    invitationService.sendInvitation(invitation, userDetails.getReferralCode());
    return ResponseEntity.status(HttpStatus.OK).body(invitation.getFullDTO());

  }

  @Operation(summary = "Delete Invitation", description = "**Role** `PATIENT` `DOCTOR`")
  @DeleteMapping("/delete/{id}")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('DOCTOR') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<String> deleteInvitation(@PathVariable("id") Long id,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    String message = invitationService.deleteInvitation(id, userDetails.getId());
    return ResponseEntity.status(HttpStatus.OK).body(message);

  }

  @Operation(summary = "Resend Invitation", description = "Resends an invitation")
  @PostMapping("/resend/{id}")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('DOCTOR') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<String> resendInvitation(@PathVariable Long id,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Optional<Invitation> optionalInvitation = invitationService.getInvitationById(id);
    if (optionalInvitation.isPresent()) {
      Invitation invitation = optionalInvitation.get();
      invitationService.sendInvitation(invitation, userDetails.getReferralCode());
      return ResponseEntity.status(HttpStatus.OK).body("Invitation sent");

    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Invitation does not exists");
  }

  @Operation(summary = "Get invitations for authenticated user")
  @GetMapping("/users/{id}")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('DOCTOR') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<InvitationResponseDTO>> getAllUsersInvitation(@PathVariable Long id,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long targetId = AppUtils.enforceTargetIfAdmin(id, userDetails);
    return ResponseEntity.ok()
        .body(invitationService.getInvitationByUserId(targetId)
            .stream()
            .map(Invitation::getFullDTO)
            .collect(Collectors.toList()));
  }

}
