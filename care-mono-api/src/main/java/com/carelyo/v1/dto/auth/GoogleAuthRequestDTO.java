package com.carelyo.v1.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GoogleAuthRequestDTO {
  @JsonProperty(value = "access_token")
  private String accessToken;
}