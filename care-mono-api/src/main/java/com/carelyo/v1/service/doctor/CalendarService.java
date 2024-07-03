package com.carelyo.v1.service.doctor;

import com.carelyo.v1.dto.doctor.CalendarDTO.Create;
import com.carelyo.v1.model.user.doctor.Calendar;
import com.carelyo.v1.repos.doctor.CalendarRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CalendarService {

  CalendarRepository calendarRepository;

  /**
   * @param calendarRepository calendar repository
   */
  public CalendarService(CalendarRepository calendarRepository) {
    this.calendarRepository = calendarRepository;
  }

  /**
   * It creates a new Calendar object and saves it to the database
   *
   * @param calendar Create
   * @param userId   Long
   * @return A ResponseEntity object is being returned.
   */
  public Calendar createCalendarEntry(Create calendar, Long userId) {

    Calendar calendarEntry = new Calendar(calendar);
    calendarEntry.setDoctorId(userId);
    calendarRepository.save(calendarEntry);
    return calendarEntry;
  }


  /**
   * If the calendar entry exists and belongs to the doctor, delete it
   *
   * @param consultationId the id of the calendar entry
   * @param doctorId       the id of the doctor
   */
  public void deleteCalendarEntry(Long consultationId, Long doctorId) {
    if (calendarRepository.findById(consultationId).isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND,
          "Calendar entry does not exist");
    }

    Calendar calendar = calendarRepository.findById(consultationId).get();

    if (!calendar.getDoctorId().equals(doctorId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "Calendar entry does not belong to this doctor");
    }

    calendarRepository.deleteById(consultationId);
  }

  /**
   * If the calendar entry exists, and the calendar entry belongs to the doctor, update the calendar entry
   *
   * @param updateCalendarDTO This is the object that contains the updated fields.
   * @param id                the id of the calendar entry
   * @param doctorId          the id of the doctor who is logged in
   * @return A ResponseEntity with a body of the updated calendar entry.
   */
  public Calendar updateCalendarEntry(Create updateCalendarDTO, Long id, Long doctorId) {
    if (calendarRepository.findById(id).isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND,
          "Calendar entry does not exist");
    }

    Calendar calendar = calendarRepository.findById(id).get();

    if (!calendar.getDoctorId().equals(doctorId)) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
          "Calendar entry does not belong to this doctor");
    }

    Calendar updated = calendar.updateAllFields(calendar, updateCalendarDTO);
    calendarRepository.save(updated);

    return updated;
  }

  /**
   * Get all calendar entries for a doctor
   *
   * @param doctorId the id of the doctor
   * @return A ResponseEntity with a body of a list of calendar entries.
   */

  public List<Calendar> getAllCalendarEntry(Long doctorId) {

    return calendarRepository.findAllByDoctorId(doctorId);
  }

}
