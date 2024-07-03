package com.carelyo.v1.model.user;

import com.carelyo.v1.model.BaseModel;
import java.time.LocalDateTime;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.Email;
import javax.validation.constraints.Future;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class ForgotPasswordToken extends BaseModel {

  @Min(0)
  private int tries;
  @NotBlank
  private String token;
  @Email
  private String email;
  @Enumerated(EnumType.STRING)
  private Status status;
  @Future
  private LocalDateTime expiresAt;

  public ForgotPasswordToken(String token, String email) {
    this.token = token;
    this.email = email;
    this.expiresAt = LocalDateTime.now().plusHours(2);
  }

  public void incrementTries() {
    this.tries++;
  }

  public boolean isExpired() {
    return LocalDateTime.now().isAfter(this.expiresAt);
  }

  public boolean isBlocked() {
    if (this.tries >= 3 && this.status != Status.BLOCKED) {
      setStatusBlocked();
    }

    return this.status == Status.BLOCKED;
  }

  public void setStatusBlocked() {
    this.status = Status.BLOCKED;
    this.expiresAt = LocalDateTime.now().plusMinutes(5);
  }

  public enum Status {
    BLOCKED
  }
}