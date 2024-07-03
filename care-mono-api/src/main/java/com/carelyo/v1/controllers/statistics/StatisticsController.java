package com.carelyo.v1.controllers.statistics;

import com.carelyo.v1.service.admin.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Statistics")
@RequestMapping("/api/v1/statistics")
public class StatisticsController {

  private final StatisticsService statisticsService;

  public StatisticsController(StatisticsService statisticsService) {
    this.statisticsService = statisticsService;
  }

  @Operation(summary = "Get total completed consultations between two dates", description = "**Role** 'SYSTEMADMIN'")
  @GetMapping("/consultations/completed")
  @PreAuthorize("hasAuthority('SYSTEMADMIN') or hasAuthority('DOCTOR')")
  public ResponseEntity<Integer> getTotalCompletedConsultations(long startDate, long endDate) {
    return ResponseEntity.ok()
        .body(statisticsService.getTotalCompletedConsultations(startDate, endDate));
  }

  @Operation(summary = "Get average consultation duration between two dates", description = "**Role** 'SYSTEMADMIN'")
  @GetMapping("/consultations/avg-duration")
  @PreAuthorize("hasAuthority('SYSTEMADMIN') or hasAuthority('DOCTOR')")
  public ResponseEntity<Long> getAvgConsultationDuration(long startDate, long endDate) {
    return ResponseEntity.ok()
        .body(statisticsService.getAvgConsultationDuration(startDate, endDate));
  }
}