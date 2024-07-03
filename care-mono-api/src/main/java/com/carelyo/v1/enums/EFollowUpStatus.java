package com.carelyo.v1.enums;

public enum EFollowUpStatus {
  INACTIVE("inactive"),
  ACTIVE("active"),
  EXPIRED("expired");
  private final String textVal;

  EFollowUpStatus(String textVal) {
    this.textVal = textVal;
  }

  public String getTextVal() {
    return this.textVal;
  }
}
