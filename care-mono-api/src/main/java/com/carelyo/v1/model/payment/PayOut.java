package com.carelyo.v1.model.payment;

import com.carelyo.v1.model.BaseModel;
import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PayOut extends BaseModel {

  /**
   * The id of the service owner / receiver of the $$$
   */
  private long userId;

  /**
   * The id of the service ie consultationId or like.
   */
  @Column(unique = true)
  private long serviceId;

  /*******************************************
   * Date when the patient has paid for the service.
   */
  @Column(unique = true)
  private String payStackRef;

  /***************************************
   * Date when on payroll.
   */
  private LocalDateTime dateOnPayRoll;

  /**
   * Set to true when Service is delivered (ConsultationStatus == finished)
   */
  private boolean onPayRoll;

  /******************************************
   * Date when on payslip
   */
  private LocalDateTime dateOnPaySlip;
  /**
   * Set to true when accept to put on payslip
   */
  private boolean onPaySlip;

  /******************************************
   * Date when product is paid out to product owner (doctor).
   */
  private LocalDateTime datePaidOut;

  /**
   * Set to true when paid out.
   */
  private boolean paidOut;

  /**
   * Reference from Bank etc. when Transaction for payout is done
   */
  private String payoutReference;

  /**
   * The userId of the Admin that made the payout
   */
  private Long paidByUserId;

  /**
   * Id of the PriceList
   */
  private String priceListName;
  private double price;
  private double vat;
  private double commission;
  private double toBePaidOut;


}
