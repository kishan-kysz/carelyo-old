package com.carelyo.v1.service.consultation.quartz;

import com.carelyo.v1.service.consultation.FollowUpService;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;

public class FollowUpReminderJob implements Job {

  private final FollowUpService followUpService;

  public FollowUpReminderJob(FollowUpService followUpService) {
    this.followUpService = followUpService;
  }

  @Override
  public void execute(JobExecutionContext context) {

    JobDataMap dataMap = context.getJobDetail().getJobDataMap();

    // For template
    String id = dataMap.getString("id");
    String firstReminder = dataMap.getString("first_reminder");
    String lastReminder = dataMap.getString("last_reminder");

    // Do the work
    followUpService.followUpReminder(
        Long.parseLong(id),
        Boolean.getBoolean(firstReminder),
        Boolean.getBoolean(lastReminder));
  }
}
