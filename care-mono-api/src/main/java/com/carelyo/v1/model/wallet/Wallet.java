package com.carelyo.v1.model.wallet;

import com.carelyo.v1.model.BaseModel;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
@Entity
public class Wallet extends BaseModel {

  @Column(unique = true)
  private Long userId;
  @OneToMany(cascade = CascadeType.ALL)
  private List<Transaction> transactions;
  private Double balance;
  private String externalAccount;
  private String virtualAccount;
  private String bankCode;
  private String recipientRef;
}
