package com.carelyo.v1.model.topup;
import com.carelyo.v1.model.BaseModel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Data

public class TopUp extends BaseModel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Long userId;
  private String email;
  private String reference;
  private String name;
  private Boolean isValid;
  private Double amountPaid;
  private String bank;
  private String accountNumber;
}

