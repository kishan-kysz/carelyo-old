package com.carelyo.v1.service.payout;

import com.carelyo.v1.dto.payout.PayoutDTO.DoctorPaidOutResponse;
import com.carelyo.v1.dto.payout.PayoutDTO.DoctorToBePaidResponse;
import com.carelyo.v1.model.consultation.Consultation;
import com.carelyo.v1.model.payment.PayOut;
import com.carelyo.v1.model.revenue.Revenue;
import com.carelyo.v1.model.wallet.ETransactionType;
import com.carelyo.v1.model.wallet.Transaction;
import com.carelyo.v1.model.wallet.Wallet;
import com.carelyo.v1.repos.payout.PayOutRepository;
import com.carelyo.v1.service.pricelist.PriceListService;
import com.carelyo.v1.service.revenue.RevenueService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.wallet.WalletService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@Slf4j
public class PayoutService {

  private final PayOutRepository payOutRepository;
  private final PriceListService priceListService;
  private final WalletService walletService;
  private final RevenueService revenueService;

  public PayoutService(PayOutRepository payOutRepository, PriceListService priceListService,
      WalletService walletService, RevenueService revenueService) {
    this.payOutRepository = payOutRepository;
    this.priceListService = priceListService;
    this.walletService = walletService;
    this.revenueService = revenueService;
  }

  public PayOut findPayout(Long id) {
    PayOut payOut = payOutRepository
        .findByServiceId(id).orElse(null);
    if (payOut == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Payout doesn't exist");
    }
    return payOut;
  }

  /**
   * Initialize a payout with a pay stack reference.
   *
   * @param consultation Consultation consultation.
   */
  public void initPayOut(Consultation consultation) {

    // Build Payout
    PayOut payOut = new PayOut();
    payOut.setPayStackRef(consultation.getTransactionReference());
    payOut.setServiceId(consultation.getId());
    payOut.setPriceListName(consultation.getPriceListName());
    payOut.setPrice(priceListService.getPriceById(consultation.getPriceListName()));
    payOut.setCommission(priceListService.getCommissionById(consultation.getPriceListName()));
    payOut.setVat(priceListService.getVatById(consultation.getPriceListName()));
    payOut.setToBePaidOut(priceListService.getToBePaidOut(consultation.getPriceListName()));

    payOutRepository.save(payOut);
    log.info("Payout record created with pay stack reference: "
        + consultation.getTransactionReference());
  }


  /**
   * Adds the payout to the payroll to a specific doctor. When: The consultation is finished in
   * BookingService.java
   *
   * @param consultation the canceled consultation
   * @param userId       the doctor or any other that should receive the payment
   */
  public double addToPayRoll(Consultation consultation, long userId) {
    long serviceId = consultation.getId();
    PayOut payOut = findPayout(serviceId);

    LocalDateTime stamp = LocalDateTime.now(); // Get same stamp on Roll and Slip.

    payOut.setDateOnPayRoll(stamp);
    payOut.setOnPayRoll(true);
    payOut.setDateOnPaySlip(stamp);
    payOut.setOnPaySlip(true);
    payOut.setUserId(userId);
    payOutRepository.save(payOut);
    log.info("Service id: " + serviceId + " added to payroll for doctorId: " + userId);

    Transaction transaction = new Transaction();
    transaction.setReference(stamp.toString());
    transaction.setType(ETransactionType.DEBIT);
    transaction.setText("Finnish consultation id: " + serviceId);
    transaction.setAccount("Carelyo");
    transaction.setAmount(priceListService.getToBePaidOut(consultation.getPriceListName()));

    // Transaction to wallet
    Wallet wallet = walletService.getWalletByPatientId(userId);
    double balance = walletService.addTransactionToWallet(wallet, transaction);

    // Transaction to Revenue
    Revenue revenue = new Revenue();
    revenue.setReference(stamp.toString());
    revenue.setType(ETransactionType.DEBIT);
    revenue.setText(transaction.getText());
    revenue.setAccount("Carelyo");
    revenue.setAmount(priceListService.getCommissionById(consultation.getPriceListName()));
    revenue.setDoctorId(consultation.getDoctorId());
    revenue.setConsultationId(consultation.getId());
    revenueService.addRevenue(revenue);
    return balance;
  }


  /**
   * Deletes the payout from database. If not on payslip or paid out.
   *
   * @param serviceId ie Consultation
   * @return boolean
   */
  public boolean deletePayOut(long serviceId) {
    PayOut payOut = findPayout(serviceId);

    if (!payOut.isOnPaySlip() || payOut.isPaidOut()) {
      payOutRepository.delete(payOut);
      return true;
    } else {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "Payout is already on payslip or has already been paid out");
    }
  }


  /**
   * mark payout as paid.
   *
   * @param serviceId   ie. consultationId
   * @param reference   Reference from bank etc.
   * @param userDetails Gets logged in Admin userId.
   * @return boolean
   */
  public boolean markAsPaid(long serviceId, String reference, UserDetailsImpl userDetails) {
    PayOut payOut = findPayout(serviceId);
    try {
      payOut.setDatePaidOut(LocalDateTime.now());
      payOut.setPaidOut(true);
      payOut.setPaidByUserId(userDetails.getId());
      payOut.setPayoutReference(reference);
      payOutRepository.save(payOut);
      return true;
    } catch (Exception e) {
      log.error(e.getMessage());
      return false;
    }
  }

  public List<PayOut> getPayRoll(LocalDateTime startDate, LocalDateTime endDate) {
    return payOutRepository.findAllByOnPayRollIsTrueAndPaidOutIsFalseAndDateOnPayRollBetween
        (startDate, endDate);

  }

  /**
   * Payouts that's on the PayRoll.
   *
   * @return List<PayOut>
   */
  public List<PayOut> getPayRollHistory(LocalDateTime startDate, LocalDateTime endDate) {
    return payOutRepository.findByPaidOutIsTrueAndDatePaidOutBetween
        (startDate, endDate);

  }

  /**
   * Payouts that's on the Payslip.
   *
   * @return List<DoctorToBePaidResponse>
   */
  public List<DoctorToBePaidResponse> getPaySlip(long userId, LocalDateTime startDate,
      LocalDateTime endDate) {
    return payOutRepository
        .findAllByUserIdAndOnPayRollIsTrueAndOnPaySlipIsTrueAndPaidOutIsFalseAndDateOnPayRollBetween
            (userId, startDate, endDate).stream()
        .map(payOut -> new DoctorToBePaidResponse(
            payOut.getId(),
            payOut.getPriceListName(),
            payOut.getServiceId(),
            payOut.getDateOnPaySlip(),
            payOut.getToBePaidOut()
        )).collect(Collectors.toList());

  }

  /**
   * Get doctors payslip history, services that's been paid out. If no startDate or endDate is set
   */

  public List<DoctorPaidOutResponse> getPaySlipHistory(long userId, LocalDateTime startDate,
      LocalDateTime endDate) {
    return payOutRepository
        .findAllByUserIdAndPaidOutIsTrueAndDatePaidOutBetween
            (userId, startDate, endDate).stream()
        .map(payOut -> new DoctorPaidOutResponse(
            payOut.getId(), payOut.getPriceListName(), payOut.getServiceId(),
            payOut.getDateOnPaySlip(), payOut.getDatePaidOut(),
            payOut.getPayoutReference(),
            payOut.getToBePaidOut()
        )).collect(Collectors.toList());

  }
}
