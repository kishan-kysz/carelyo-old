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
public class ScheduledStatusChangeToBooked {

  private final Scheduler scheduler;
  private static final Integer minutes = Integer.valueOf(System.getenv("STATUS_TO_BOOKED_DELAY"));
  public ScheduledStatusChangeToBooked(Scheduler scheduler) {
    this.scheduler = scheduler;
  }

  public void startJob(Long consultationId) throws SchedulerException {
    String param = consultationId.toString();
    JobDetail job = JobBuilder.newJob(StatusChangeJobToBooked.class)
        .usingJobData("Consultation-id", param)
        .storeDurably(false)
        .build();

    Date delay = Date.from(LocalDateTime.now().plusMinutes(minutes)
        .atZone(ZoneId.systemDefault()).toInstant());

    Trigger trigger = TriggerBuilder.newTrigger()
        .startAt(delay)
        .build();

    scheduler.scheduleJob(job, trigger);
  }

}
