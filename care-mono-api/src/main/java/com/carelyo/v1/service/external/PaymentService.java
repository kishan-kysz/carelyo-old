package com.carelyo.v1.service.external;

import com.carelyo.v1.dto.PaymentVerificationDTO;
import com.carelyo.v1.dto.consultation.PaystackDTO.Data;
import com.carelyo.v1.model.wallet.ETransactionType;
import com.carelyo.v1.model.wallet.Transaction;
import com.carelyo.v1.model.wallet.Wallet;
import com.carelyo.v1.service.external.externalpayment.ExternalPaymentService;
import com.carelyo.v1.service.external.externalpayment.dto.StripeForwardInfo;
import com.carelyo.v1.service.patient.PatientService;
import com.carelyo.v1.service.provider.ProviderService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.stripecurrency.StripeCurrencyService;
import com.carelyo.v1.service.wallet.WalletService;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import java.util.Objects;
import java.util.UUID;

/**
 * Service to decide if local paystack should be used or an external service should be used
 */
@Log4j2
@Service
public class PaymentService {

  private final ExternalPaymentService externalPaymentService;
  private final StripeCurrencyService stripeCurrencyService;
  private final PaystackService paystackService;
  private final PatientService patientService;
  private final ProviderService providerService;
  private final WalletService walletService;
  // This environment variable decide the default service to use.

  public PaymentService(ExternalPaymentService externalPaymentService,
      StripeCurrencyService stripeCurrencyService, PaystackService paystackService,
      PatientService patientService, ProviderService providerService, WalletService walletService) {
    this.externalPaymentService = externalPaymentService;
    this.stripeCurrencyService = stripeCurrencyService;
    this.paystackService = paystackService;
    this.patientService = patientService;
    this.providerService = providerService;
    this.walletService = walletService;
  }

  public Data initPayment(
      Double amount,
      UserDetailsImpl userDetails) {
    String currency = getCurrency(userDetails);
    Long providerId = getProviderId(userDetails);
    String email = userDetails.getEmail();
    String paymentProvider;

    paymentProvider = (stripeCurrencyService.existsByCode(currency)) ? "stripe" : "paystack";

    Data dto;

    if (getWalletBalance(userDetails) >= amount) {
      dto = useWallet(amount, userDetails);

      log.info("returning dto:");
      log.info(dto.toString());

      return dto;

    } else if (getWalletBalance((userDetails)) > 0) {
      double walletBalance = getWalletBalance(userDetails);
      double newWithdraw = amount - walletBalance;
      log.info("Credit wallet:");
      log.info(walletBalance);

      log.info("New wallet balance:");
      log.info(getWalletBalance(userDetails));

      amount = newWithdraw;
    }

    StripeForwardInfo stripeForwardInfo = new StripeForwardInfo();

    if (Objects.equals(paymentProvider, "paystack")) {
      return paystackService.initializeTransaction(amount, currency, email);
    }
    amount *= 100;
    stripeForwardInfo.setCurrency(currency);
    stripeForwardInfo.setProviderId(providerId);
    stripeForwardInfo.setAmount(amount.longValue());
    stripeForwardInfo.setOrderId(getUUIdAsString());
    System.out.println(stripeForwardInfo);
    return externalPaymentService.init(stripeForwardInfo);
  }

  public String verifyPayment(PaymentVerificationDTO verification, UserDetailsImpl userDetails)
      throws InterruptedException {
    if (Objects.equals(verification.getPaymentProvider(), "paystack")
        || Objects.equals(verification.getPaymentProvider(), "wallet")) {

      String status = paystackService.verifyTransactionForBooking(verification.getReferenceId());
      if (Objects.equals(verification.getPaymentProvider(), "paystack")) {
        var wallet = walletService.getAuthedUserWallet(userDetails);
        useWallet(wallet.getBalance(), userDetails);
      }
      return status;
    }
    String status = externalPaymentService.verifyStripePayment(verification);
    var wallet = walletService.getAuthedUserWallet(userDetails);
    useWallet(wallet.getBalance(), userDetails);

    return status;
  }

  private String getCurrency(UserDetailsImpl userDetails) {
    var patient = patientService.getPatientByUserId(userDetails.getId());
    if (patient.getProviderId() == null) {
      throw new RuntimeException("provider must be selected");
    }
    var provider = providerService.getProviderInformation(patient.getProviderId());
    return provider.getCurrency();
  }

  private Long getProviderId(UserDetailsImpl userDetails) {
    var patient = patientService.getPatientByUserId(userDetails.getId());
    var provider = providerService.getProviderInformation(patient.getProviderId());
    return provider.getId();
  }

  private double getWalletBalance(UserDetailsImpl userDetails) {
    var wallet = walletService.getAuthedUserWallet(userDetails);
    return wallet.getBalance();
  }

  public Data useWallet(Double amount, UserDetailsImpl userDetails) {

    // Open the wallet and spend some $$$
    Wallet wallet = walletService.getWalletByPatientId(userDetails.getId());
    long timeStamp = System.currentTimeMillis();

    // If the wallet covers the amount to be paid, pay with wallet and return
    Transaction transaction = new Transaction();
    transaction.setAccount("wallet");
    transaction.setType(ETransactionType.CREDIT);
    transaction.setAmount(amount);
    transaction.setReference("wallet" + timeStamp);
    transaction.setText("Payment for consultation \n" +
        timeStamp);

    walletService.addTransactionToWallet(wallet, transaction);

    log.info("Wallet transaction made.");
    log.info(transaction.toString());

    Data dto = new Data(
        null,
        "wallet" + timeStamp,
        "wallet",
        "none",
        "wallet"
    );
    log.info("Return dto:");
    log.info(dto.toString());
    return dto;
  }

  private String getUUIdAsString() {
    return UUID.randomUUID().toString();
  }

}
