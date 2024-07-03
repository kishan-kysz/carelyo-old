package com.carelyo.v1.dto.topup;

import javax.validation.constraints.NotEmpty;

public class TopUpDTO {
  @NotEmpty
  private String reference;

  @NotEmpty
 private String name;


  @NotEmpty
  private Double amountPaid;

  @NotEmpty
private String bank;



  @NotEmpty
  public String accountNumber;

  public String getReference(){
    return reference;
  }
  public String getName(){
    return name;
  }

  public void setReference(String reference){
    this.reference = reference;
  }

  public void setName(String name){
    this.name = name;
  }

  public Double getAmountPaid() {
    return amountPaid;
  }

  public void setAmountPaid(Double amountPaid) {
    this.amountPaid = amountPaid;
  }
  public String getBank() {
    return bank;
  }

  public void setBank(String bank) {
    this.bank = bank;
  }
  public String getAccountNumber() {
    return accountNumber;
  }

  public void setAccountNumber(String accountNumber) {
    this.accountNumber = accountNumber;
  }


}
