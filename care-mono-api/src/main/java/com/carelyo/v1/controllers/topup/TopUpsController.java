package com.carelyo.v1.controllers.topup;

import com.carelyo.v1.dto.topup.AccountInformationDTO;
import com.carelyo.v1.dto.topup.TopUpDTO;
import com.carelyo.v1.dto.topup.TopUpVerifyDTO;
import com.carelyo.v1.dto.topup.UnverifiedTopUpDTO;
import com.carelyo.v1.model.topup.TopUp;
import com.carelyo.v1.model.user.User;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.topup.TopUpService;

import java.util.List;
import java.util.Set;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/topup")
@Tag(name = "TopUp", description = "**Role:** `SYSTEMADMIN` `PATIENT`")
public class TopUpsController {
  private final TopUpService topUpService;

  public TopUpsController(TopUpService topUpService){this.topUpService = topUpService;}




  @PostMapping
  @PreAuthorize("hasAuthority('PATIENT')")
  public ResponseEntity<TopUp> createTopUp(TopUpDTO schema, @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long userId = userDetails.getId();
    TopUp createdTopUp = topUpService.createTopUp(schema, userId);

    if (createdTopUp != null) {
      return ResponseEntity.status(HttpStatus.CREATED).body(createdTopUp);
    } else {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/unverified")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<Set<TopUp>> getUnverifiedTopUps(@AuthenticationPrincipal UserDetailsImpl userDetails) {
    Set<TopUp> unverifiedTopUps = topUpService.getUnverifiedTopUps();
    return ResponseEntity.ok(unverifiedTopUps);
  }


  @GetMapping("/unverified/{topUpId}/details")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<TopUp> getUnverifiedTopUpById(
      @PathVariable("topUpId") Long topUpId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {


TopUp topUp = topUpService.getUnverifiedTopUpById(topUpId);

    return topUp != null ? ResponseEntity.ok(topUp) : ResponseEntity.notFound().build();
  }

  @GetMapping("/unverified/user/{userId}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<TopUp>> getUnverifiedTopUpByUserId(
      @PathVariable("userId") Long userId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {

    List<TopUp> topUps = topUpService.getUnverifiedTopUpByUserId(userId);
    return ResponseEntity.ok(topUps);
  }


  @GetMapping("/unverified/email/{email}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<TopUp>> getUnverifiedTopUpByEmail(
      @PathVariable("email") String email,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {

    List<TopUp> topUps = topUpService.getUnverifiedTopUpByEmail(email);
    return  ResponseEntity.ok(topUps);
  }




  @PatchMapping("/verify")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<String> verifyTopUp(@RequestBody TopUpVerifyDTO schema, @AuthenticationPrincipal UserDetailsImpl userDetails) {
    if (userDetails.getId() != 1) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to perform this operation.");
    }

    topUpService.verifyTopUp(schema);
    return ResponseEntity.ok("Top-up verified successfully");
  }



}
