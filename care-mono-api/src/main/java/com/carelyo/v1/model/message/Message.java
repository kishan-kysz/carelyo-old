package com.carelyo.v1.model.message;

import com.carelyo.v1.dto.user.MessageDTO;
import com.carelyo.v1.model.BaseModel;
import com.carelyo.v1.model.role.Role;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Message extends BaseModel {

  public static Comparator<Message> dateComparator = Comparator.comparing(Message::getCreatedAt);
  public static Comparator<Message> dateTimeComparator = Comparator.comparing(
      Message::getUpdatedAt);

  String subject;
  String sender;
  @Lob
  String message;
  @ManyToMany(fetch = FetchType.LAZY)
  Set<Role> roles = new HashSet<>();
  Long userId;
  boolean hasBeenRead;
  boolean isWelcomeMessage;

  public Message(String subject, String sender, String message) {
    this.subject = subject;
    this.sender = sender;
    this.message = message;
  }

  public Message(String subject, String sender, String message, Set<Role> roles) {
    this.subject = subject;
    this.sender = sender;
    this.message = message;
    this.roles = roles;
  }

  public Message(String subject, String sender, String message, Long userId) {
    this.subject = subject;
    this.sender = sender;
    this.message = message;
    this.userId = userId;
  }

  public MessageDTO.Response getMessageDTO() {
    return new MessageDTO.Response(
        this.getId(),
        this.subject,
        this.sender,
        this.message,
        this.getCreatedAt(),
        this.getUpdatedAt());
  }

  public MessageDTO.UserSpecificResponse getUserSpecificMessageDTO() {
    return new MessageDTO.UserSpecificResponse(
        this.getId(),
        this.subject,
        this.sender,
        this.message,
        this.getCreatedAt(),
        this.getUpdatedAt(),
        this.hasBeenRead);
  }
}
