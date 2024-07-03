package com.carelyo.v1.model.user.doctor;

import com.carelyo.v1.dto.doctor.CalendarDTO.Create;
import com.carelyo.v1.model.BaseModel;
import java.time.LocalDateTime;
import javax.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Calendar extends BaseModel {

  private Long doctorId;
  private LocalDateTime start;
  private LocalDateTime end;
  private String title;
  private String description;
  private String color;
  private Boolean allDay;
  private String url;
  private Boolean availabilityStatus;
  private Boolean patientAppointment;
  private Long childId;


  // create new calendar entry
  public Calendar(Create request) {
    this.start = request.getStart();
    this.end = request.getEnd();
    this.title = request.getTitle();
    this.description = request.getDescription();
    this.color = request.getColor();
    this.allDay = request.getAllDay();
    this.url = request.getUrl();
    this.availabilityStatus = request.getAvailabilityStatus();
    this.patientAppointment = request.getPatientAppointment();
    this.childId = request.getChildId();
  }

  // update calendar entry with provided data
  public Calendar updateAllFields(Calendar current, Create calendar) {
    current.setStart(calendar.getStart());
    current.setEnd(calendar.getEnd());
    current.setTitle(calendar.getTitle());
    current.setDescription(calendar.getDescription());
    current.setColor(calendar.getColor());
    current.setAllDay(calendar.getAllDay());
    current.setUrl(calendar.getUrl());
    current.setAvailabilityStatus(calendar.getAvailabilityStatus());
    current.setPatientAppointment(calendar.getPatientAppointment());
    return current;
  }
}
