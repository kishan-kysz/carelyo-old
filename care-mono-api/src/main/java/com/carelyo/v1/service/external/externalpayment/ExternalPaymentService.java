package com.carelyo.v1.service.external.externalpayment;

import com.carelyo.v1.dto.PaymentVerificationDTO;
import com.carelyo.v1.dto.consultation.PaystackDTO;
import com.carelyo.v1.service.external.externalpayment.dto.StripeForwardInfo;
import com.carelyo.v1.utils.RestTemplateResponseErrorHandler;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Log4j2
public class ExternalPaymentService {

  private final RestTemplate restTemplate;
  RestTemplateBuilder restTemplateBuilder;

  public ExternalPaymentService(RestTemplateBuilder restTemplateBuilder) {
    this.restTemplate = restTemplateBuilder.errorHandler(new RestTemplateResponseErrorHandler())
        .build();
  }

  // Initialize the payment on stripe main api
  public PaystackDTO.Data init(StripeForwardInfo stripeForwardInfo) {

    HttpHeaders headers = new HttpHeaders();
    headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

    Map<String, Object> requestBody = new HashMap<>();

    requestBody.put("amount", stripeForwardInfo.getAmount());
    requestBody.put("currency", stripeForwardInfo.getCurrency());
    requestBody.put("providerId", stripeForwardInfo.getProviderId());
    requestBody.put("orderId", stripeForwardInfo.getOrderId());

    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

    log.info("http://localhost:8083/create-payment-intent");

    ResponseEntity<String> response = restTemplate.postForEntity(
        "http://localhost:8083/create-payment-intent", entity, String.class);

    ObjectMapper mapper = new ObjectMapper();
    JsonNode jsonNode;

    try {
      jsonNode = mapper.readTree(response.getBody());
      log.info("Response from stripe-main:");
      log.info(response.getBody());

      return new PaystackDTO.Data(
          "none",
          stripeForwardInfo.getOrderId(),
          "none",
          jsonNode.get("clientSecret").asText(),
          "stripe"
      );

    } catch (JsonProcessingException e) {
      throw new RuntimeException(e.getMessage());
    }
  }

  public String verifyStripePayment(PaymentVerificationDTO verification)
      throws InterruptedException {
    var headers = new HttpHeaders();
    Thread.sleep(500); //TODO WAITING FOR WEBHOOK TO RECIEVE RESPONSE IN PAYHANDLER, MOVE DELAY TO FRONT END?
    headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

    Map<String, Object> requestBody = new HashMap<>();

    requestBody.put("transactionReference", verification.getReferenceId());

    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

    log.info("http://localhost:8083/api/verifications/orderId");

    ResponseEntity<String> response = restTemplate.postForEntity(
        "http://localhost:8083/api/verifications/orderId", entity, String.class);
    ObjectMapper mapper = new ObjectMapper();
    JsonNode jsonNode;
    try {
      jsonNode = mapper.readTree(response.getBody());

      log.info("Response from stripe-main:");
      log.info(response.getBody());

    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    }
    return jsonNode.asText();
  }

}
