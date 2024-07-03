package com.carelyo.v1.model.template;

import com.carelyo.v1.enums.ETemplateTypes;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

@Setter
@Log4j2
public class TplFailedPaymentNoBooking extends ATemplate {

  final String htmlFile = "failed_payment_no_booking.html";
  final ETemplateTypes type = ETemplateTypes.FAILED_PAYMENT_NO_BOOKING;

  String recipientName;
  String patientName;
  LocalDateTime appointmentDateTime;
  String loginLink;

  public TplFailedPaymentNoBooking() {
    fetchTemplate(htmlFile);
    super.subject = "Failed payment";
  }

  @Override
  public void setProps() {
    String appointmentDate = "";
    String appointmentTime = "";

    if (appointmentDateTime != null) {
      appointmentDate = appointmentDateTime.toLocalDate().toString();
      appointmentTime =
          appointmentDateTime.toLocalTime().format(DateTimeFormatter.ofPattern("hh:mm")) + ":00";
    }
    props.put("patient_name", patientName);
    props.put("appointment_date", appointmentDate);
    props.put("appointment_time", appointmentTime);
    props.put("recipient_name", recipientName);
    props.put("login_link", loginLink);
  }

  @Override
  public void updateTemplate() {
    pushTemplate(htmlFile);
  }
}