package com.carelyo.v1.repos.support;

import com.carelyo.v1.model.support.SupportTicket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupportTicketsRepository extends CrudRepository<SupportTicket, Long> {

  Page<SupportTicket> findAllByAssigneeId(Long id, Pageable pageable);
  Page<SupportTicket> findAll(Pageable pageable);
}
