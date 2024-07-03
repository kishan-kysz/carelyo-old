package com.carelyo.v1.repos.support;

import com.carelyo.v1.model.support.SupportComments;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentsRepository extends JpaRepository<SupportComments, Long> {

  Page<SupportComments> findAllByUserId(Long id, Pageable pageable);

  Optional<SupportComments> findByTicketIdAndUserIdAndMessage(Long ticketId, Long userId, String message);
}
