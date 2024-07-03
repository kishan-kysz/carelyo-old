package com.carelyo.v1.service.external;

import com.carelyo.v1.dto.consultation.PaystackDTO;
import com.carelyo.v1.model.payment.PayStackData;
import com.carelyo.v1.model.payment.PaystackBanks;
import com.carelyo.v1.model.wallet.Transaction;
import com.carelyo.v1.model.wallet.Wallet;
import com.carelyo.v1.repos.paystack.PayStackRepository;
import com.carelyo.v1.service.doctor.DoctorService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.wallet.TransactionService;
import com.carelyo.v1.service.wallet.WalletService;
import com.carelyo.v1.service.wallet.WalletService.BankDetails;
import com.carelyo.v1.utils.RestTemplateResponseErrorHandler;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Log4j2
public class PaystackService {

  private static final String API_KEY = System.getenv("PAYSTACK_API_KEY");
  public static final String CURRENCY = System.getenv("PROVIDER_CURRENCY");
  private final RestTemplate restTemplate;
  private final PayStackRepository payStackRepository;
  private final WalletService walletService;
  private final TransactionService transactionService;
  private final DoctorService doctorService;

  public PaystackService(
      RestTemplateBuilder restTemplateBuilder,
      PayStackRepository payStackRepository,
      WalletService walletService,
      TransactionService transactionService,
      DoctorService doctorService) {

    this.restTemplate = restTemplateBuilder.errorHandler(new RestTemplateResponseErrorHandler())
        .build();
    this.payStackRepository = payStackRepository;
    this.walletService = walletService;
    this.transactionService = transactionService;
    this.doctorService = doctorService;
  }

  public PaystackDTO.Data initializeTransaction(
      Double amount,
      String currency,
      String email) {



    log.info("Using paystack");
    log.info("Provider currency");
    log.info(currency);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setBearerAuth(API_KEY);
    headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
    Map<String, Object> requestBody = new HashMap<>();
    amount *= 100;
    requestBody.put("email", email);
    requestBody.put("amount", amount.toString());
    requestBody.put("currency", currency);
    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

    log.info("Requesting https://api.paystack.co/transaction/initialize");

    ResponseEntity<String> response = restTemplate.postForEntity(
        "https://api.paystack.co/transaction/initialize", entity, String.class);
    ObjectMapper mapper = new ObjectMapper();
    JsonNode jsonNode;

    try {
      jsonNode = mapper.readTree(response.getBody());
    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    }
    log.info("Response:");
    log.info(jsonNode.get("data").asText());

    PaystackDTO.Data dto = new PaystackDTO.Data(
        jsonNode.get("data").get("authorization_url").asText(),
        jsonNode.get("data").get("reference").asText(),
        jsonNode.get("data").get("access_code").asText(),
        "none",
        "paystack"
    );
    log.info("PaystackDTO.Data:");
    log.info(dto);
    return dto;
  }


  public List<PaystackBanks> getListOfBanks() {
    // Create a RestTemplate instance
    RestTemplate restTemplate = new RestTemplate();

    // Create HttpHeaders object and set headers
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Authorization", "Bearer " + API_KEY);
    // Create an HttpEntity with headers
    HttpEntity<String> httpEntity = new HttpEntity<>(headers);

    // Make a GET request with headers
    String url = "https://api.paystack.co/bank?currency=" + CURRENCY;
    ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, httpEntity, String.class);
    List<PaystackBanks> banks = new ArrayList<>();

    if (response.hasBody()) {
      ObjectMapper mapper = new ObjectMapper();
      JsonNode jsonNode;

      try {
        jsonNode = mapper.readTree(response.getBody());
      } catch (JsonProcessingException e) {
        throw new RuntimeException(e);
      }
      for (var d : jsonNode.get("data")) {
        banks.add(new PaystackBanks(
                d.get("id").asLong(),
                d.get("name").asText(),
                d.get("slug").asText(),
                d.get("code").asText(),
                d.get("longcode").asText(),
                d.get("gateway").asText(),
                d.get("pay_with_bank").asBoolean(),
                d.get("active").asBoolean(),
                d.get("country").asText(),
                d.get("currency").asText(),
                d.get("type").asText(),
                d.get("is_deleted").asBoolean()
            )
        );
      }
    }
    // verifyAccount();
    // System.out.println(createTransferRecipient("2004209081", "057"));
    return banks;
  }

  /**
   * Verifies that the account exist and is correct.
   * @param bankDetails Account number and bank code
   * @return Account name and status of recipient creation or if it fails.
   */
  public String verifyAccount(BankDetails bankDetails, UserDetailsImpl userDetails) {
    String message = "Failed";
    System.out.println("UserId: " + userDetails.getId());

    Wallet wallet = walletService.getAuthedUserWallet(userDetails);
    if (Objects.equals(wallet.getExternalAccount(), bankDetails.getAccountNo())
        && Objects.equals(wallet.getBankCode(), bankDetails.getBankCode())) {

      return "Already verified";
    }

    // Create a RestTemplate instance
    RestTemplate restTemplate = new RestTemplate();

    // Create HttpHeaders object and set headers
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Authorization", "Bearer " + API_KEY);

    // Create an HttpEntity with requestBody and headers
    HttpEntity<String> httpEntity = new HttpEntity<>(headers);

    // Make a POST request with headers
    String url = "https://api.paystack.co/bank/resolve?account_number=" + bankDetails.getAccountNo() + "&bank_code=" + bankDetails.getBankCode();
    ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, httpEntity, String.class);

    if (response.hasBody()) {
      ObjectMapper mapper = new ObjectMapper();
      JsonNode jsonNode;

      try {
        jsonNode = mapper.readTree(response.getBody());
      } catch (JsonProcessingException e) {
        throw new RuntimeException(e);
      }

      // If valid update wallet and return some information.
      if (jsonNode.get("status").asBoolean()) {
        message = jsonNode.get("data").get("account_name").asText();
        walletService.setBankDetails(bankDetails, userDetails);
        String msg = createTransferRecipient(bankDetails, userDetails); // Message?
        return message + "\n" + msg;
      }
    }
    return message;
  }

  public String makeSingleTransfer(Wallet wallet) {
    String logMsg = "Not a registered recipient ";
    String reason = "Carelyo";
    String source = "balance"; // Always balance

    // Bail out if wallet owner has not been registered as a recipient
    if ( wallet.getRecipientRef().isEmpty() ) {
      log.error(logMsg);
      return logMsg;
    }

    // A unique reference for the transfer.
    String reference = java.util.UUID.randomUUID().toString();

    // Create a RestTemplate instance
    RestTemplate restTemplate = new RestTemplate();

    // Create HttpHeaders object and set headers
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Authorization", "Bearer " + API_KEY);

    // Create the request body
    Map<String, Object> requestBody = new HashMap<>();

    requestBody.put("source", source);
    requestBody.put("reason", reason);
    requestBody.put("reference", reference); // Unique
    requestBody.put("amount", wallet.getBalance());
    requestBody.put("recipient", wallet.getRecipientRef()); // RCP_xxxxxxxxxxx

    // Create an HttpEntity with requestBody and headers
    HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestBody, headers);

    // POST request to
    String url = "https://api.paystack.co/transferrecipient";
    ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, httpEntity, String.class);

    // Check response
    if (response.hasBody()) {
      ObjectMapper mapper = new ObjectMapper();
      JsonNode jsonNode;

      try {
        jsonNode = mapper.readTree(response.getBody());
      } catch (JsonProcessingException e) {
        throw new RuntimeException(e);
      }

      var d = jsonNode.get("data");


      log.info(jsonNode.get("message").asText());
      log.info(jsonNode.get("status").asText());
      log.info(d.get("domain").asText());
      log.info(d.get("amount").asText());
      log.info(d.get("recipient").asInt());
      log.info(d.get("status").asText());
      log.info(d.get("transfer_code").asText()); // TRF_1ptvuv321ahaa7q
      log.info(d.get("id").asText());

    }
    return "";
  }

  /**
   * Creates a Transfer Recipient
   * @param bankDetails Account and bank code
   * @param userDetails Logged in user
   * @return Message if successful or not.
   */
  private String createTransferRecipient(BankDetails bankDetails, UserDetailsImpl userDetails) {
    String message = "Error trying to create recipient."; // Return value
    boolean status;
    String recipientRef;

    String firstName = doctorService.getByUserId(userDetails.getId()).getFirstName();
    String lastName = doctorService.getByUserId(userDetails.getId()).getLastName();

    // Create a RestTemplate instance
    RestTemplate restTemplate = new RestTemplate();

    // Create HttpHeaders object and set headers
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Authorization", "Bearer " + API_KEY);

    Map<String, Object> requestBody = new HashMap<>();

    requestBody.put("type", "nuban");
    requestBody.put("name", firstName + " " + lastName);
    requestBody.put("account_number", bankDetails.getAccountNo());
    requestBody.put("bank_code", bankDetails.getBankCode());
    requestBody.put("currency", "NGN");

    // Create an HttpEntity with requestBody and headers
    HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestBody, headers);

    // Make a POST request with headers
    String url = "https://api.paystack.co/transferrecipient";
    ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, httpEntity, String.class);

    if (response.hasBody()) {
      ObjectMapper mapper = new ObjectMapper();
      JsonNode jsonNode;

      try {
        jsonNode = mapper.readTree(response.getBody());
      } catch (JsonProcessingException e) {
        throw new RuntimeException(e);
      }

      message = jsonNode.get("message").asText();
      status = jsonNode.get("status").asBoolean();
      recipientRef = jsonNode.get("data").get("recipient_code").asText();

      // Save bank details in wallet only if everything went well
      if (status) {
        walletService.setBankDetails(bankDetails, userDetails);
        walletService.setRecipientRef(recipientRef, userDetails);
        return "Recipient successfully created.";
      } else {
        return message;
      }
    }
    return message + " No response body.";
  }

  // Need to get reference value from initialize transaction body inside the json
  // response and append it after the very url
  public String verifyTransactionForBooking(String reference) {

    // Return something useful if paid only with wallet.
    if (reference.contains("wallet")) {
      Optional<Transaction> optionalTransaction = transactionService.getTransactionByRef(
          reference);
      if (optionalTransaction.isPresent()) {
        return "success";
      } else {
        return "failed";
      }

    }

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setBearerAuth(API_KEY);
    headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(headers);

    ResponseEntity<String> response = restTemplate.exchange(
        "https://api.paystack.co/transaction/verify/{reference}", HttpMethod.GET, entity,
        String.class, reference);
    ObjectMapper mapper = new ObjectMapper();
    JsonNode jsonNode;
    try {
      jsonNode = mapper.readTree(response.getBody());
    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    }

    // Build and save PayStackData and initialize a payout if transaction is successful.
    if (jsonNode.get("data").get("status").asText().equals("success")) {

      DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      LocalDateTime date = LocalDateTime.parse(jsonNode.get("data").get("paid_at").asText(), formatter);

      PayStackData payStackData = PayStackData.builder()
          .domain(jsonNode.get("data").get("domain").asText())
          .reference(jsonNode.get("data").get("reference").asText())
          .status(jsonNode.get("data").get("status").asText())
          .amount(jsonNode.get("data").get("amount").asDouble())
          .paidAt(date)
          .build();

      payStackRepository.save(payStackData);

    }

    return jsonNode.get("data").get("status").toString().replace("\"", "");
  }

  public PayStackData getPayStackByReference(String payStackRef)
      throws ResourceNotFoundException {
    return payStackRepository
        .findById(payStackRef)
        .orElseThrow(ResourceNotFoundException::new);
  }

  public Double paidInAmount(String payStackRef) {
    return payStackRepository
        .findById(payStackRef)
        .orElseThrow(ResourceNotFoundException::new)
        .getAmount();
  }
}
