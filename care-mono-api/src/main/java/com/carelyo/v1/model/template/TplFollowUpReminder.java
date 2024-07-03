package com.carelyo.v1.model.template;

import com.carelyo.v1.enums.ETemplateTypes;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

@Setter
@Log4j2
public class TplFollowUpReminder extends ATemplate {

  final String htmlFile = "followup_reminder.html";
  final ETemplateTypes type = ETemplateTypes.FOLLOWUP_REMINDER;

  private String patientTitle;
  private String patientName;
  private LocalDateTime followupDateTime;
  private String clinicName;
  private String yourName;
  private String loginLink;

  public TplFollowUpReminder() {
    fetchTemplate(htmlFile);
    super.subject = "Follow up reminder";
  }

  @Override
  public void setProps() {
    String appointmentDate = "";
    String appointmentTime = "";

    if (followupDateTime != null) {
      appointmentDate = followupDateTime.toLocalDate().toString();
      appointmentTime =
          followupDateTime.toLocalTime().format(DateTimeFormatter.ofPattern("hh:mm")) + ":00";
    }
    props.put("patient_title", patientTitle);
    props.put("patient_name", patientName);
    props.put("appointment_date", appointmentDate);
    props.put("appointment_time", appointmentTime);
    props.put("clinic_name", clinicName);
    props.put("your_name", yourName);
    props.put("login_link", loginLink);
  }

  @Override
  public void updateTemplate() {
    pushTemplate(htmlFile);
  }
}
