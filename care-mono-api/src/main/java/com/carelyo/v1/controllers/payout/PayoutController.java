package com.carelyo.v1.controllers.payout;

import com.carelyo.v1.dto.payout.PayoutDTO.DoctorPaidOutResponse;
import com.carelyo.v1.dto.payout.PayoutDTO.DoctorToBePaidResponse;
import com.carelyo.v1.model.payment.PayOut;
import com.carelyo.v1.model.revenue.Revenue;
import com.carelyo.v1.model.wallet.Wallet;
import com.carelyo.v1.service.external.PaystackIntegration;
import com.carelyo.v1.service.external.PaystackService;
import com.carelyo.v1.service.payout.PayoutService;
import com.carelyo.v1.service.revenue.RevenueService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.wallet.WalletService;
import com.carelyo.v1.service.wallet.WalletService.BankDetails;
import com.carelyo.v1.utils.AppUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDateTime;
import java.util.List;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Payout")
@PreAuthorize("hasAuthority('SYSTEMADMIN')")
@RequestMapping("/api/v1/payout")
public class PayoutController {

  private final PayoutService payoutService;
  private final RevenueService revenueService;
  private final PaystackService paystackService;
  private final WalletService walletService;
  private final PaystackIntegration paystackIntegration;

  public PayoutController(PayoutService payoutService, RevenueService revenueService,
      PaystackService paystackService, WalletService walletService, PaystackIntegration paystackIntegration) {
    this.payoutService = payoutService;
    this.revenueService = revenueService;
    this.paystackService = paystackService;
    this.walletService = walletService;
    this.paystackIntegration = paystackIntegration;
  }

  @Operation(summary = "Delete a payout. Only if NOT on payslip or paid out", description = "**Role** 'SYSTEMADMIN'")
  @DeleteMapping("/delete-payout/{serviceId}")
  public ResponseEntity<Boolean> deletePayOut(@PathVariable("serviceId") long serviceId) {
    return ResponseEntity.ok(payoutService.deletePayOut(serviceId));
  }

  @Operation(summary = "Mark payout as paid. Admin userId will be recorded as payer. Reference from bank should be sent in body"
      + "Optional should be removed when implemented in frontend. ", description = "**Role** 'SYSTEMADMIN'")
  @PutMapping("/mark-as-paid/{serviceId}")
  @Parameter(name = "userDetails", hidden = true)
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<Boolean> markAsPaid(
      @PathVariable("serviceId") long serviceId,
      @RequestParam(required = false) String reference,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.ok(payoutService.markAsPaid(serviceId, reference, userDetails));
  }

  @Operation(summary = "Get's all that's will be paid out next time. Between two dates or up until current date time. ", description = "**Role** 'SYSTEMADMIN'")
  @GetMapping("/get-payroll")
  public ResponseEntity<List<PayOut>> getPayroll(
      @RequestParam(required = false) LocalDateTime optStartDate,
      @RequestParam(required = false) LocalDateTime optEndDate) {

    LocalDateTime startDate = optStartDate;
    LocalDateTime endDate = optEndDate;
    if (optStartDate == null) {
      startDate = LocalDateTime.parse("2020-01-01T12:00:00");
    }
    if (endDate == null) {
      endDate = LocalDateTime.now();
    }
    return ResponseEntity.ok(payoutService.getPayRoll(startDate, endDate));

  }

  @Operation(summary = "Get's all that's been paid out on payroll. Between two dates or up until current date time. ", description = "**Role** 'SYSTEMADMIN'")
  @GetMapping("/get-payroll-history")
  public ResponseEntity<List<PayOut>> getPayrollHistory(
      @RequestParam(required = false) LocalDateTime optStartDate,
      @RequestParam(required = false) LocalDateTime optEndDate) {

    LocalDateTime startDate = optStartDate;
    LocalDateTime endDate = optEndDate;
    if (optStartDate == null) {
      startDate = LocalDateTime.parse("2020-01-01T12:00:00");
    }
    if (endDate == null) {
      endDate = LocalDateTime.now();
    }
    // Returns an empty array if no records
    return ResponseEntity.ok(payoutService.getPayRollHistory(startDate, endDate));

  }

  @Operation(summary = "What's will be paid out next time on userId. Between two dates or up until current date time. ", description = "**Role** 'DOCTOR' or SYSTEMADMIN")
  @GetMapping("/get-payslip")
  @Parameter(name = "userDetails", hidden = true)
  @PreAuthorize("hasAuthority('DOCTOR')  or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<DoctorToBePaidResponse>> getPayslip(
      @RequestParam(required = false, value = "userId") Long userId,
      @RequestParam(required = false) LocalDateTime optStartDate,
      @RequestParam(required = false) LocalDateTime optEndDate,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {

    Long targetId = AppUtils.enforceTargetIfAdmin(userId, userDetails);

    LocalDateTime startDate = optStartDate;
    LocalDateTime endDate = optEndDate;
    if (optStartDate == null) {
      startDate = LocalDateTime.parse("2020-01-01T12:00:00");
    }
    if (endDate == null) {
      endDate = LocalDateTime.now();
    }

    // Returns an empty array if no records
    return ResponseEntity.ok(payoutService.getPaySlip(targetId, startDate, endDate));

  }

  @Operation(summary = "What's been paid out by userId. Between two dates or up until current date time.", description = "**Role** 'DOCTOR' or SYSTEMADMIN")
  @GetMapping("/get-payslip-history")
  @Parameter(name = "userDetails", hidden = true)
  @PreAuthorize("hasAuthority('DOCTOR')  or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<DoctorPaidOutResponse>> getPayslipHistory(
      @RequestParam(required = false, value = "userId") Long userId,
      @RequestParam(required = false) LocalDateTime optStartDate,
      @RequestParam(required = false) LocalDateTime optEndDate,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {

    Long targetId = AppUtils.enforceTargetIfAdmin(userId, userDetails);
    LocalDateTime startDate = optStartDate;
    LocalDateTime endDate = optEndDate;
    if (optStartDate == null) {
      startDate = LocalDateTime.parse("2020-01-01T12:00:00");
    }
    if (endDate == null) {
      endDate = LocalDateTime.now();
    }

    // Returns an empty array if no records
    return ResponseEntity.ok(payoutService.getPaySlipHistory(targetId, startDate, endDate));

  }

  @Operation(summary = "Get a list of all Carelyo revenues.", description = "**Role** 'SYSTEMADMIN'")
  @GetMapping("/revenues")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<Revenue>> getRevenues() {
    return ResponseEntity.ok(revenueService.getAllRevenues());
  }

  @Operation(summary = "Get wallet", description = "Wallet owner gets his wallet")
  @GetMapping("/wallet")
  @PreAuthorize("hasAuthority('DOCTOR')  or hasAuthority('SYSTEMADMIN') or hasAuthority('DOCTOR')")
  public ResponseEntity<Wallet> getWallet(@AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.ok(walletService.getAuthedUserWallet(userDetails));
  }

  @Operation(summary = "Get bank list from paystack", description = "Shows valid banks and telcos in Nigeria")
  @GetMapping("/banks")
  @PreAuthorize("hasAuthority('DOCTOR') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<PaystackIntegration.PaystackBanks>> getBanks() {
    return ResponseEntity.ok(
        paystackIntegration.getBanks().block().getData());
  }

  @Operation(summary = "Account & Code")
  @PostMapping("/bdetails")
  @PreAuthorize("hasAuthority('DOCTOR')  or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<?> setBankDetails(@RequestBody BankDetails bDetails,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.ok(paystackService.verifyAccount(bDetails, userDetails));
  }
}
