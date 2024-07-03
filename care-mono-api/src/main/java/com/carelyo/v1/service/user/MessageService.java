package com.carelyo.v1.service.user;

import com.carelyo.v1.dto.user.MessageDTO;
import com.carelyo.v1.model.message.Message;
import com.carelyo.v1.model.role.ERole;
import com.carelyo.v1.model.user.User;
import com.carelyo.v1.repos.user.MessageRepository;
import com.carelyo.v1.service.security.AccessService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MessageService {

  private final MessageRepository messageRepository;
  private final UserService userService;
  private final AccessService accessService;

  private final String notFoundMessage = " with the provided id could not be found or does not exist";

  public MessageService(MessageRepository messageRepository, UserService userService,
      AccessService accessService) {
    this.messageRepository = messageRepository;
    this.userService = userService;
    this.accessService = accessService;
  }

  public void save(Message welcomeMessage) {
    messageRepository.save(welcomeMessage);
  }

  public Message createRoleSpecificMessage(
      MessageDTO.CreateRoleSpecificMessage createRoleSpecificMessageDTO) {
    Message message = new Message(
        createRoleSpecificMessageDTO.getSubject(), createRoleSpecificMessageDTO.getSender(),
        createRoleSpecificMessageDTO.getMessage(),
        createRoleSpecificMessageDTO.getRoles());

    messageRepository.save(message);

    return message;
  }

  public Message createUserSpecificMessage(
      MessageDTO.CreateUserSpecificMessage createUserSpecificMessage) {
    if (userService.findById(createUserSpecificMessage.getUserId()).isPresent()) {
      Message message = new Message(
          createUserSpecificMessage.getSubject(), createUserSpecificMessage.getSender(),
          createUserSpecificMessage.getMessage(),
          createUserSpecificMessage.getUserId());

      messageRepository.save(message);

      return message;
    }

    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User" + notFoundMessage);
  }

  public Message createMessageToAllUsers(
      MessageDTO.CreateMessageToAllUsers createMessageToAllUsersDTO) {
    Message message = new Message(
        createMessageToAllUsersDTO.getSubject(), createMessageToAllUsersDTO.getSender(),
        createMessageToAllUsersDTO.getMessage());

    messageRepository.save(message);

    return message;
  }

  public List<Message> getAllMessages() {
    return new ArrayList<>(messageRepository.findAll());
  }

  public void deleteMessage(Long messageId) {
    if (messageRepository.findById(messageId).isPresent()) {
      Message message = messageRepository.findById(messageId).get();
      messageRepository.delete(message);
    } else {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Message" + notFoundMessage);
    }
  }

  public Message getMessage(Long messageId) {
    if (messageRepository.findById(messageId).isPresent()) {
      return messageRepository.findById(messageId).get();
    } else {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Message" + notFoundMessage);
    }
  }

  public List<Message> getUserMessages(Long userId, UserDetailsImpl userDetails) {
    Long id;

    if (userId == null) {
      id = userDetails.getId();
    } else {
      id = userId;
    }

    if (userService.findById(id).isPresent()) {
      if (accessService.accessByUserId(id, userDetails)
          || accessService.accessByRole(userDetails, new ERole[]{ERole.SYSTEMADMIN})) {
        User user = userService.findById(id).get();
        return messageRepository
            .findAll()
            .stream()
            .filter(message -> isMessageToAll(message) || message.getRoles()
                .stream()
                .anyMatch((role) -> user.getRole().equals(role))
                || (message.getUserId() != null && message.getUserId()
                .equals(user.getId())))
            .collect(Collectors.toList());
      }

      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
          "You are not authorized to access this resource");
    }

    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User" + notFoundMessage);
  }

  public boolean isMessageToAll(Message message) {
    return message.getUserId() == null && message.getRoles().isEmpty();
  }

  public void setMessageAsRead(Long messageId, UserDetailsImpl userDetails) {
    Message message = getMessage(messageId);

    if (userDetails.getId() == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
          "You are not authorized to access this resource");
    }

    if (!Objects.equals(userDetails.getId(), message.getUserId())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
          "You are not authorized to access this resource");
    }

    if (message.isHasBeenRead()) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "Message has already been read");
    }

    message.setHasBeenRead(true);
    messageRepository.save(message);
  }

  public void deleteMessageAsUser(Long messageId, UserDetailsImpl userDetails) {
    Message message = getMessage(messageId);

    if (userDetails.getId() == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
          "You are not authorized to access this resource");
    }

    if (!Objects.equals(userDetails.getId(), message.getUserId())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
          "You are not authorized to access this resource");
    }

    messageRepository.delete(message);
  }

  public Message getWelcomeMessage() {
    return messageRepository.findByIsWelcomeMessageTrue().orElseThrow(() -> new ResponseStatusException(
        HttpStatus.NOT_FOUND, "Welcome message does not exist"));
  }

  public Message updateWelcomeMessage(MessageDTO.UpdateWelcomeMessage updateWelcomeMessageDTO) {
    Message welcomeMessage = messageRepository.findByIsWelcomeMessageTrue()
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Welcome message does not exist"));

    welcomeMessage.setSubject(updateWelcomeMessageDTO.getSubject());
    welcomeMessage.setSender(updateWelcomeMessageDTO.getSender());
    welcomeMessage.setMessage(updateWelcomeMessageDTO.getMessage());

    messageRepository.save(welcomeMessage);

    return welcomeMessage;
  }

  public boolean isWelcomeMessageTrue() {
    return messageRepository.findByIsWelcomeMessageTrue().isPresent();
  }
}