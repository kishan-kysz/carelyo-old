package com.carelyo.v1.repos.user;

import com.carelyo.v1.model.user.ForgotPasswordToken;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ForgotPasswordTokenRepository extends JpaRepository<ForgotPasswordToken, Long> {

  Optional<ForgotPasswordToken> findByEmail(String email);
  Optional<ForgotPasswordToken> findByToken(String token);
}