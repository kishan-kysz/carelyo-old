package com.carelyo.v1.controllers.user;

import com.carelyo.v1.dto.user.MessageDTO;
import com.carelyo.v1.model.message.Message;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.user.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Message")
@RequestMapping("/api/v1/messages")
public class MessageController {

  private final MessageService messageService;

  public MessageController(MessageService messageService) {
    this.messageService = messageService;
  }

  @Operation(summary = "Create a role specific message", description = "**Role:** `SYSTEMADMIN`")
  @PostMapping("/create/roles")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<MessageDTO.Response> createRoleSpecificMessage(
      @Valid @RequestBody MessageDTO.CreateRoleSpecificMessage createRoleSpecificMessageDTO) {
    MessageDTO.Response messageDTO = messageService.createRoleSpecificMessage(
        createRoleSpecificMessageDTO).getMessageDTO();
    return ResponseEntity.ok().body(messageDTO);
  }

  @Operation(summary = "Create a user specific message", description = "**Role:** `SYSTEMADMIN` `DOCTOR` ")
  @PostMapping("/create/user")
  @PreAuthorize("hasAuthority('SYSTEMADMIN') or hasAuthority('DOCTOR')")
  public ResponseEntity<MessageDTO.Response> createUserSpecificMessage(
      @Valid @RequestBody MessageDTO.CreateUserSpecificMessage createUserSpecificMessage) {
    MessageDTO.Response messageDTO = messageService.createUserSpecificMessage(
        createUserSpecificMessage).getMessageDTO();
    return ResponseEntity.ok().body(messageDTO);
  }

  @Operation(summary = "Create a message to all users", description = "**Role:** `SYSTEMADMIN`")
  @PostMapping("/create/users")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<MessageDTO.Response> createMessageToAllUsers(
      @Valid @RequestBody MessageDTO.CreateMessageToAllUsers createMessageToAllUsers) {
    MessageDTO.Response messageDTO = messageService.createMessageToAllUsers(
        createMessageToAllUsers).getMessageDTO();
    return ResponseEntity.ok().body(messageDTO);
  }

  @Operation(summary = "Get a message", description = "**Role:** `SYSTEMADMIN`")
  @GetMapping("/message/{messageId}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<MessageDTO.Response> getMessage(
      @PathVariable("messageId") Long messageId) {
    MessageDTO.Response messageDTO = messageService.getMessage(messageId).getMessageDTO();
    return ResponseEntity.ok().body(messageDTO);
  }

  @Operation(summary = "Get all messages", description = "**Role:** `SYSTEMADMIN`")
  @GetMapping
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<MessageDTO.Response>> getAllMessages() {
    List<MessageDTO.Response> messageDTOList = messageService.getAllMessages()
        .stream()
        .map(Message::getMessageDTO)
        .collect(Collectors.toList());
    return ResponseEntity.ok().body(messageDTOList);
  }

  @Operation(summary = "Delete a message", description = "**Role:** `SYSTEMADMIN`")
  @DeleteMapping("/delete/{messageId}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<String> deleteMessage(@PathVariable("messageId") Long messageId) {
    messageService.deleteMessage(messageId);
    return ResponseEntity.ok().body("Message deleted successfully");
  }

  @Operation(summary = "Get a users messages", description = "**Role:** `DOCTOR` `SYSTEMADMIN` `PATIENT`")
  @GetMapping("/user")
  @Parameter(name = "userDetails", hidden = true)
  @PreAuthorize("hasAnyAuthority('DOCTOR', 'PATIENT','SYSTEMADMIN')")
  public ResponseEntity<List<MessageDTO.UserSpecificResponse>> getUserMessages(
      @RequestParam(value = "userId", required = false) Long userId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    List<MessageDTO.UserSpecificResponse> messageDTOList = messageService.getUserMessages(userId,
        userDetails)
        .stream()
        .map(Message::getUserSpecificMessageDTO)
        .collect(Collectors.toList());
    return ResponseEntity.ok().body(messageDTOList);
  }

  @Operation(summary = "Set message as read", description = "**Role:** `DOCTOR` `PATIENT`")
  @PutMapping("/read/{messageId}")
  @PreAuthorize("hasAnyAuthority('DOCTOR', 'PATIENT')")
  public ResponseEntity<String> setMessageAsRead(@PathVariable("messageId") Long messageId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    messageService.setMessageAsRead(messageId, userDetails);
    return ResponseEntity.ok().body("Message read successfully");
  }

  @Operation(summary = "Delete a message as user", description = "**Role:** `DOCTOR` `PATIENT`")
  @DeleteMapping("/user/delete/{messageId}")
  @PreAuthorize("hasAnyAuthority('DOCTOR', 'PATIENT')")
  public ResponseEntity<String> deleteMessageAsUser(@PathVariable("messageId") Long messageId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    messageService.deleteMessageAsUser(messageId, userDetails);
    return ResponseEntity.ok().body("Message deleted successfully");
  }

  @Operation(summary = "Get welcome message", description = "Role: `SYSTEMADMIN`")
  @GetMapping("/welcome")
  @PreAuthorize("hasAnyAuthority('SYSTEMADMIN', 'DOCTOR', 'PATIENT')")
  public ResponseEntity<MessageDTO.Response> getWelcomeMessage() {
    MessageDTO.Response messageDTO = messageService.getWelcomeMessage().getMessageDTO();
    return ResponseEntity.ok().body(messageDTO);
  }

  @Operation(summary = "Update welcome message", description = "Role: `SYSTEMADMIN`")
  @PutMapping("/update/welcome")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<MessageDTO.Response> updateWelcomeMessage(
      @Valid @RequestBody MessageDTO.UpdateWelcomeMessage updateWelcomeMessageDTO) {
    MessageDTO.Response messageDTO = messageService.updateWelcomeMessage(
        updateWelcomeMessageDTO).getMessageDTO();
    return ResponseEntity.ok().body(messageDTO);
  }
}