package com.carelyo.v1.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GoogleAuthResponseDTO {

  private String sub;
  private String email;
  @JsonProperty("email_verified")
  private boolean emailVerified;
  @JsonProperty("family_name")
  private String familyName;
  @JsonProperty("given_name")
  private String givenName;
  private String hd;
  private String locale;
  private String name;
  private String picture;
  private String phone;


}
