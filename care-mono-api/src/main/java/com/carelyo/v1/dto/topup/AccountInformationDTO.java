package com.carelyo.v1.dto.topup;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountInformationDTO {

  @JsonProperty("accountNumber")
  private String accountNumber;

  @JsonProperty("companyName")
  private String companyName;





}