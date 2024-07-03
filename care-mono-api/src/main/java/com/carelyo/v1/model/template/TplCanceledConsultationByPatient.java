package com.carelyo.v1.model.template;

import com.carelyo.v1.enums.ETemplateTypes;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

@Setter
@Log4j2
public class TplCanceledConsultationByPatient extends ATemplate {

  final String htmlFile = "cancelled_consultation_by_patient.html";
  final ETemplateTypes type = ETemplateTypes.CANCEL_CONSULTATION_PATIENT;

  String patientName;
  LocalDateTime appointmentDateTime;
  String doctorName;
  String clinicName;
  String yourName;
  String amount;
  String loginLink;

  public TplCanceledConsultationByPatient() {
    this.fetchTemplate(htmlFile);
    super.subject = "Consultation canceled.";
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
    props.put("doctor_name", doctorName);
    props.put("clinic_name", clinicName);
    props.put("your_name", yourName);
    props.put("amount", amount);
    props.put("login_link", loginLink);
  }

  @Override
  public void updateTemplate() {
    pushTemplate(htmlFile);
  }
}
