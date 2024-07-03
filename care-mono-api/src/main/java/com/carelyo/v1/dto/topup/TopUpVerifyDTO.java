package com.carelyo.v1.dto.topup;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

public class TopUpVerifyDTO {
  @NotNull
  @Positive
  private Long id;
  @NotNull
  private Boolean isValid;
  @NotNull
  @Positive
  private  Double amountPaid;

  //Getters
  public Long getId(){
    return id;
  }
  public Boolean getIsValid(){
    return isValid;
  }
  public Double getAmountPaid(){
    return amountPaid;
  }

  //Setters
  public void setId(Long id){
    this.id = id;
  }
  public void setIsValid(Boolean isValid){
    this.isValid = isValid;
  }
  public void setAmountPaid(Double amountPaid){
    this.amountPaid = amountPaid;
  }

}
