package com.carelyo.v1.repos.support;

import com.carelyo.v1.model.support.SupportActions;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportActionsRepository extends JpaRepository<SupportActions, Long> {

  Iterable<SupportActions> findAllByTicketId(Long id);

}
