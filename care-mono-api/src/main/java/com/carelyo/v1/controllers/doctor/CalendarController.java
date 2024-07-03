package com.carelyo.v1.controllers.doctor;

import com.carelyo.v1.dto.doctor.CalendarDTO;
import com.carelyo.v1.model.user.doctor.Calendar;
import com.carelyo.v1.service.doctor.CalendarService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Calendar")
@RequestMapping("/api/v1/calendar")

public class CalendarController {

  @Autowired
  CalendarService calendarService;

  @Operation(summary = "Get all doctor events", description = "**Role:** `Doctor`")
  @GetMapping("/events")
  @PreAuthorize("hasAuthority('DOCTOR') or hasAuthority('SYSTEMADMIN')")
  // A method that returns a list of all the calendar entries of a doctor.
  public ResponseEntity<List<Calendar>> getAllDoctorEvents(
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long currentUserId = userDetails.getId();
    return ResponseEntity.ok().body(calendarService.getAllCalendarEntry(currentUserId));
  }

  @Operation(summary = "create a new event", description = "**Role:** `Doctor`")
  @PostMapping("/event/create")
  @PreAuthorize("hasAuthority('DOCTOR') or hasAuthority('SYSTEMADMIN')")
  // A method that creates a new calendar entry.
  public ResponseEntity<Calendar> createCalenderEntry(@RequestBody CalendarDTO.Create calendar,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long currentUserId = userDetails.getId();
    return ResponseEntity.ok()
        .body(calendarService.createCalendarEntry(calendar, currentUserId));
  }

  @Operation(summary = "delete an event", description = "**Role:** `Doctor`")
  @DeleteMapping("/event/delete")
  @PreAuthorize("hasAuthority('DOCTOR') or hasAuthority('SYSTEMADMIN')")
  // A method that deletes a calendar entry.
  public ResponseEntity<String> deleteCalendarEntry(@RequestParam Long entryId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long currentUserId = userDetails.getId();
    calendarService.deleteCalendarEntry(entryId, currentUserId);
    return ResponseEntity.ok().body("Calendar entry deleted");
  }

  @Operation(summary = "update an event", description = "**Role:** `Doctor`")
  @PutMapping("/event/update")
  @PreAuthorize("hasAuthority('DOCTOR') or hasAuthority('SYSTEMADMIN')")
  // A method that updates a calendar entry.
  public ResponseEntity<Calendar> updateCalendarEntry(@RequestParam() Long entryId,
      @RequestBody CalendarDTO.Create calendar,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Long currentUserId = userDetails.getId();
    return ResponseEntity.ok()
        .body(calendarService.updateCalendarEntry(calendar, entryId, currentUserId));
  }
}