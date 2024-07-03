package com.carelyo.v1.model.revenue;

import com.carelyo.v1.model.wallet.Transaction;
import javax.persistence.Entity;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
@Entity
public class Revenue extends Transaction {

  long doctorId;
  long consultationId;

}
