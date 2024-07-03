package com.carelyo.v1.repos.user;

import com.carelyo.v1.model.message.Message;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

  Optional<Message> findByIsWelcomeMessageTrue();
}
