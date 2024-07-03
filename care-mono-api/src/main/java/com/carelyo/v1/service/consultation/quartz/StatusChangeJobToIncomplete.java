package com.carelyo.v1.service.consultation.quartz;

import com.carelyo.v1.service.consultation.ConsultationService;
import java.text.MessageFormat;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;

public class StatusChangeJobToIncomplete implements Job {

  private final ConsultationService consultationService;

  public StatusChangeJobToIncomplete(ConsultationService consultationService) {
    this.consultationService = consultationService;
  }

  @Override
  public void execute(JobExecutionContext context) {
    JobDataMap dataMap = context.getJobDetail().getJobDataMap();
    String param = dataMap.getString("Consultation-id");

    System.out.println(MessageFormat.format("Job: {0}; Param: {1}",
        getClass(), param));

    // Delegate task to ConsultationService
    consultationService.statusToIncomplete(Long.parseLong(param));
  }
}
