package com.carelyo.v1.service.support;

import com.carelyo.v1.model.support.SupportActions;
import com.carelyo.v1.repos.support.SupportActionsRepository;
import org.springframework.stereotype.Service;

@Service
public class SupportActionService {


  private final SupportActionsRepository supportActionRepository;


  public SupportActionService(SupportActionsRepository supportActionRepository) {

    this.supportActionRepository = supportActionRepository;
  }


  public void createSupportAction(Long userId, Long ticketId, String action, String message) {
    SupportActions actions = new SupportActions();
    actions.setUserId(userId);
    actions.setTicketId(ticketId);
    actions.setAction(action);
    actions.setMessage(message);
    supportActionRepository.save(actions);
  }


}
