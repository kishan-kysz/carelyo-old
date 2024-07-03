package com.carelyo.v1.dto.provider;

import lombok.Value;

@Value
public class ProviderFormDTO {

  String providerName;
  String phoneNumber;
  String address;
  String practiceNumber;
  String email;
  String secondaryEmail;
  String webPageUrl;
  String country;
  String currency;
  String logoURL;
  String providerType;

}
