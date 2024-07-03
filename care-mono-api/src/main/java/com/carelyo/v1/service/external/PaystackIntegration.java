package com.carelyo.v1.service.external;

import java.time.Duration;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.log4j.Log4j2;
import reactor.core.publisher.Mono;

@Service
@Log4j2
public class PaystackIntegration {

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PaymentResponse {
        @JsonProperty("status")
        String status;
        @JsonProperty("message")
        String message;
        @JsonProperty("data")
        PaymentResponseData data;

    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PaymentResponseData {
        String authorization_url;
        String reference;
        String access_code;

    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PaystackBankResponse {
        @JsonProperty("status")
        String status;
        @JsonProperty("message")
        String message;
        @JsonProperty("data")
        List<PaystackBanks> data;

    }

    private static class PaymentRequest {
        @JsonProperty("email")
        String email;
        @JsonProperty("amount")
        String amount;

        public PaymentRequest(String email, String amount) {
            this.email = email;
            this.amount = amount;
        }

    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PaystackBanks {
        @JsonProperty("id")
        long id;
        @JsonProperty("name")
        String name;
        @JsonProperty("slug")
        String slug;
        @JsonProperty("code")
        String code;
        @JsonProperty("longCode")
        String longCode;
        @JsonProperty("gateway")
        String gateway;
        @JsonProperty("payWithBank")
        Boolean payWithBank;
        @JsonProperty("active")
        Boolean active;
        @JsonProperty("country")
        String country;
        @JsonProperty("currency")
        String currency;
        @JsonProperty("type")
        String type;
        @JsonProperty("isDeleted")
        Boolean isDeleted;

    }

    WebClient webclient() {
        final int size = 16 * 1024 * 1024;
        final ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(size))
                .build();

        // Todo - default header is not working, you have to add it to every request
        // even though it is set here as default why?
        return WebClient
                .builder()
                .exchangeStrategies(strategies)
                .baseUrl("https://api.paystack.co")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + API_KEY)
                .filter((request, next) -> {
                    log.info("Request: " + request);
                    return next.exchange(request);
                })
                .build();
    }

    @Value("${paystack.api.key}")
    private String API_KEY;
    @Value("${provider.currency}")
    private String CURRENCY;
    @Value("${paystack.api.timeout}")
    private int TIMEOUT;
    private WebClient webClient = webclient();

    public Mono<PaymentResponse> initiatePayment(String email, String amount) {

        return webClient.post().uri("/transaction/initialize")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + API_KEY)
                .bodyValue(new PaymentRequest(email, amount))
                .retrieve()
                .bodyToMono(PaymentResponse.class)
                .timeout(Duration.ofSeconds(TIMEOUT))
                .doOnSuccess(response -> log.info("Response: " + response))
                .doOnError(error -> log.error("Error: " + error));

    }

    public PaymentResponse verify(String reference) {
        Mono<PaymentResponse> response = webClient.get().uri("/transaction/verify/" + reference)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + API_KEY)
                .retrieve()
                .bodyToMono(PaymentResponse.class);
        return response.block();
    }

    public Mono<PaystackBankResponse> getBanks() {
        return webClient.get().uri("/bank?currency=" + CURRENCY)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + API_KEY)
                .retrieve()
                .bodyToMono(PaystackBankResponse.class);
    }

    public PaymentResponseData fromWallet(String authorization_url,
            String reference,
            String access_code) {
        return new PaymentResponseData(authorization_url, reference, access_code);
    }
}
