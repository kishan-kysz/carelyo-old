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
public class FollowUpReminderScheduler {

  private final Scheduler scheduler;

  public FollowUpReminderScheduler(Scheduler scheduler) {
    this.scheduler = scheduler;
  }

  public void startJob(Long followUpId, Long timeLeft, Boolean firstReminder,
      Boolean lastReminder) throws SchedulerException {

    JobDetail job = JobBuilder.newJob(FollowUpReminderJob.class)
        .usingJobData("id", followUpId)
        .usingJobData("first_reminder", firstReminder)
        .usingJobData("last_reminder", lastReminder)
        .build();

    Date onReminder = Date.from(LocalDateTime.now().plusMinutes(timeLeft)
        .atZone(ZoneId.systemDefault()).toInstant());

    Trigger trigger = TriggerBuilder.newTrigger()
        .startAt(onReminder)
        .build();

    scheduler.scheduleJob(job, trigger);
  }

}
