package com.carelyo.v1.service.external;

import com.carelyo.v1.dto.consultation.DailyVideoDTO.AccessTokenRequest;
import com.carelyo.v1.dto.consultation.DailyVideoDTO.RoomResponse;
import com.carelyo.v1.utils.RestTemplateResponseErrorHandler;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class DailyVideoService {

  private final RestTemplate restTemplate;


  private final String dailyApiKey = System.getenv("DAILY_VIDEO_APIKEY");

  private final String apiUrl = "https://api.daily.co/v1";

  public DailyVideoService(RestTemplateBuilder restTemplateBuilder) {
    this.restTemplate = restTemplateBuilder.errorHandler(new RestTemplateResponseErrorHandler())
        .build();
  }

  public RoomResponse createRoom(Double duration) {

    HttpHeaders headers = new HttpHeaders();
    // set `content-type` header
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setBearerAuth(dailyApiKey);
    // set `accept` header
    headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
    // build the request body
    Map<String, Object> properties = new HashMap<>();
    properties.put("max_participants", 2);
    properties.put("exp", System.currentTimeMillis() / 1000 + (60 * 60 * duration)); // 24 hours
    Map<String, Object> requestBody = new HashMap<>();
    requestBody.put("privacy", "private");
    requestBody.put("properties", properties);
    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
    String response = restTemplate.postForEntity(apiUrl + "/rooms", entity, String.class)
        .getBody();

    //  Parse the response to an object
    ObjectMapper mapper = new ObjectMapper();
    JsonNode jsonNode;
    try {
      jsonNode = mapper.readTree(response);
    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    }
    return new RoomResponse(
        jsonNode.get("id").asText(),
        jsonNode.get("name").asText(),
        jsonNode.get("api_created").asBoolean(),
        jsonNode.get("url").asText(),
        jsonNode.get("created_at").asText(),
        jsonNode.get("privacy").asText()
    );

  }

  public String getAccessToken(String roomName,
      String userName,
      Long userId,
      Integer ejectAfterElapsed,
      Boolean isOwner) {
    if (roomName == null || roomName.isEmpty()) {
      return null;
    }

    HttpHeaders headers = new HttpHeaders();
    // set `content-type` header
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setBearerAuth(dailyApiKey);
    // set `accept` header
    headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
    // build the request body

    AccessTokenRequest accessTokenRequest = new AccessTokenRequest(roomName, userName, userId,
        ejectAfterElapsed,
        isOwner);

    Map<String, Object> properties = new HashMap<>();

    properties.put("properties", accessTokenRequest);

    HttpEntity<Object> entity = new HttpEntity<>(properties, headers);

    return restTemplate.postForObject(apiUrl + "/meeting-tokens", entity,
        String.class);

  }

  public void deleteRoom(String roomName) {
    HttpHeaders headers = new HttpHeaders();
    // set `content-type` header
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setBearerAuth(dailyApiKey);
    // set `accept` header
    headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
    // build the request body
    Map<String, Object> properties = new HashMap<>();
    properties.put("name", roomName);
    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(properties, headers);
    try {
      String res = restTemplate.exchange(apiUrl + "/rooms/{name}", HttpMethod.DELETE, entity,
          String.class, roomName).getBody();
      log.info("Room deleted: " + res);
    } catch (Exception e) {
      log.error("Error deleting room: " + e.getMessage());
    }
  }
}
