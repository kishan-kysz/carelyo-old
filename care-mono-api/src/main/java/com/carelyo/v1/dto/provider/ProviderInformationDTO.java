package com.carelyo.v1.dto.provider;

import lombok.Value;

@Value
public class ProviderInformationDTO {

  Long id;
  String address;
  String providerName;
  String webPageUrl;
  String logoURL;
  String country;
  String currency;
  String providerType;

}
