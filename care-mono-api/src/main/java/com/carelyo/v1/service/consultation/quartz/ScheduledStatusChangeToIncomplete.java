package com.carelyo.v1.service.consultation.quartz;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.springframework.stereotype.Service;

@Service
public class ScheduledStatusChangeToIncomplete {

  private final Scheduler scheduler;


  public ScheduledStatusChangeToIncomplete(Scheduler scheduler) {
    this.scheduler = scheduler;
  }

  public void startJob(Long consultationId, int duration) throws SchedulerException {
    String param = consultationId.toString();
    JobDetail job = JobBuilder.newJob(StatusChangeJobToIncomplete.class)
        .usingJobData("Consultation-id", param)
        .storeDurably(false)
        .build();

    // Calculate time in future to trigger the job
    Date afterDuration = Date.from(LocalDateTime.now().plusMinutes(duration)
        .atZone(ZoneId.systemDefault()).toInstant());

    Trigger trigger = TriggerBuilder.newTrigger()
        .startAt(afterDuration)
        .build();

    // Schedule the job
    scheduler.scheduleJob(job, trigger);
  }

}
