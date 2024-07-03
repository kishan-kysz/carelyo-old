package com.carelyo.v1.model.provider;

import com.carelyo.v1.dto.provider.ProviderInformationDTO;
import com.carelyo.v1.model.BaseModel;
import javax.persistence.Column;
import javax.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Provider extends BaseModel {

  private String providerName;
  private String phoneNumber;
  private String address;
  private String practiceNumber;
  private String email;
  private String secondaryEmail;
  private String webPageUrl;
  @Column(length = 512)
  private String logoURL;
  private String logoFilePath;
  private String bucketName;
  private String country;
  private String currency;
  private Boolean isDefault;
  private String providerType;

  public ProviderInformationDTO getProviderInformationDTO() {
    return new ProviderInformationDTO
        (super.getId(), address, providerName, webPageUrl, logoURL, country, currency, providerType);
  }
}
