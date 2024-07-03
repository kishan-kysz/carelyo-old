package com.carelyo.v1.controllers.support;

import com.carelyo.v1.dto.support.SupportDto.CreateAction;
import com.carelyo.v1.dto.support.SupportDto.CreateComment;
import com.carelyo.v1.dto.support.SupportDto.CreateSupportRequest;
import com.carelyo.v1.dto.support.SupportDto.CreateSupportTicket;
import com.carelyo.v1.dto.support.SupportDto.SupportTicketListResponse;
import com.carelyo.v1.dto.support.SupportDto.SupportTicketResponse;
import com.carelyo.v1.dto.support.SupportDto.UpdateSupportTicket;
import com.carelyo.v1.model.support.SupportComments;
import com.carelyo.v1.model.support.SupportTicket;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.support.CommentService;
import com.carelyo.v1.service.support.InquiryService;
import com.carelyo.v1.service.support.SupportActionService;
import com.carelyo.v1.service.support.SupportService;
import com.carelyo.v1.service.user.SystemAdminService;
import com.carelyo.v1.utils.enums.SupportEnums.Category;
import com.carelyo.v1.utils.enums.SupportEnums.SupportPriority;
import com.carelyo.v1.utils.enums.SupportEnums.SupportStatus;
import com.carelyo.v1.utils.enums.SupportEnums.SupportType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
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
import org.springframework.web.server.ResponseStatusException;

@RestController
@Tag(name = "Support", description = "Support Ticket Management, **Role:**`SYSTEMADMIN`")
@RequestMapping("/api/v1/support")
@PreAuthorize("hasAuthority('SYSTEMADMIN')")
// @Slf4j

public class SupportController {

  private final SystemAdminService systemAdminService;
  private final SupportService supportService;
  private final CommentService commentService;
  private final SupportActionService supportActionService;
  private final InquiryService inquiryService;

  public SupportController(SupportService supportService,
      CommentService commentService, SupportActionService supportActionService,
      SystemAdminService systemAdminService, InquiryService inquiryService) {
    this.supportService = supportService;
    this.commentService = commentService;
    this.supportActionService = supportActionService;
    this.systemAdminService = systemAdminService;
    this.inquiryService = inquiryService;
  }

  @Operation(summary = "Create a support ticket from an inquiry", description = "**Role:**`SYSTEMADMIN`")
  @PostMapping("/ticket/create")
  public ResponseEntity<SupportTicketResponse> getSupportActions(
      @RequestBody CreateSupportRequest entryDto,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    CreateSupportTicket entry = new CreateSupportTicket(userDetails.getId(), entryDto);
    SupportTicketResponse ticket = supportService.createTicket(entry).getTicketResponse();
    String createdBy = systemAdminService.getOne(userDetails.getId())
        .getFirstName(); // temporary
    supportActionService.createSupportAction(userDetails.getId(), ticket.getId(),
        "Ticket Created",
        String.format(
            "Ticket updated by " + createdBy + "from inquiry " + entry.getInquiryId()));
    return ResponseEntity.ok().body(ticket);
  }

  @Operation(summary = "Update a support ticket", description = "**Role:**`SYSTEMADMIN`")
  @PutMapping("/ticket/update")
  public ResponseEntity<SupportTicketResponse> updateSupportTicket(
      @RequestBody UpdateSupportTicket entry,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    SupportTicketResponse ticket = supportService.updateTicket(entry).getTicketResponse();
    String createdBy = systemAdminService.getOne(userDetails.getId())
        .getFirstName(); // temporary
    supportActionService.createSupportAction(userDetails.getId(), ticket.getId(),
        "Ticket Updated",
        String.format("Ticket updated by " + createdBy));
    return ResponseEntity.ok().body(ticket);
  }

  @Operation(summary = "Get a support ticket", description = "**Role:**`SYSTEMADMIN`")
  @GetMapping("/ticket/{entryId}")
  public ResponseEntity<SupportTicketResponse> getSupportTicket(
      @PathVariable("entryId") Long entryId) {
    SupportTicketResponse ticket = supportService.getTicket(entryId).getTicketResponse();
    List<String> images = inquiryService.getImagesUrls(ticket.getInquiry().getId());
    ticket.getInquiry().setImages(images);
    return ResponseEntity.ok().body(ticket);
  }

  @Operation(summary = "Get all support tickets", description = "**Role:**`SYSTEMADMIN`")
  @GetMapping("/tickets")
  public ResponseEntity<Page<SupportTicketListResponse>> getAllSupportTickets(Pageable pageable) {
    return ResponseEntity.ok()
        .body(supportService.getTickets(pageable)
            .map(SupportTicket::getTicketListResponse));
  }

  @Operation(summary = "Get all support tickets for the currently logged in user", description = "**Role:**`SYSTEMADMIN`")
  @GetMapping("/ticket/assignee")
  public ResponseEntity<Page<SupportTicketListResponse>> getAllSupportTicketsByUser(
      Pageable pageable,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.ok()
        .body(supportService.getTicketsByUser(userDetails.getId(), pageable)
            .map(SupportTicket::getTicketListResponse));
  }

  @Operation(summary = "Assign a support ticket to a user", description = "**Role:**`SYSTEMADMIN`")
  @PutMapping("/ticket/assign/{ticketId}")
  public ResponseEntity<SupportTicketResponse> assignTicket(
      @PathVariable("ticketId") Long ticketId,
      @RequestParam(value = "assigneeId") Long assigneeId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    if (assigneeId == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Assignee id is required");
    }

    String createdBy = systemAdminService.getByUserId(userDetails.getId())
        .getFirstName(); // temporary
    String assignedTo = systemAdminService.getByUserId(assigneeId)
        .getFirstName(); // temporary
    SupportTicketResponse ticket = supportService.assignTicket(ticketId, assigneeId)
        .getTicketResponse();

    supportActionService.createSupportAction(userDetails.getId(), ticket.getId(),
        "Ticket Assigned",
        String.format("Ticket assigned to " + assignedTo + "by " + createdBy));

    return ResponseEntity.ok()
        .body(ticket);
  }

  @Operation(summary = "Removes the assignee from the ticket", description = "**Role:**`SYSTEMADMIN`")
  @PutMapping("/ticket/unassign/{id}")
  public ResponseEntity<SupportTicketResponse> assignTicket(@PathVariable("id") Long entryId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    SupportTicketResponse ticket = supportService.unAssignTicket(entryId)
        .getTicketResponse();
    supportActionService.createSupportAction(userDetails.getId(), entryId,
        "Ticket Unassigned",
        String.format("Ticket Unassigned by " + userDetails.getUsername()));
    return ResponseEntity.ok()
        .body(ticket);
  }

  @Operation(summary = "Update tickets status, priority, type or category", description = "**Role:**`SYSTEMADMIN`")
  @PutMapping("/ticket/update/{ticketId}")
  public ResponseEntity<SupportTicketResponse> updateTicketStatus(
      @PathVariable("ticketId") Long ticketId,
      @AuthenticationPrincipal UserDetailsImpl userDetails,
      @RequestParam(value = "category", required = false) Category category,
      @RequestParam(value = "type", required = false) SupportType type,
      @RequestParam(value = "priority", required = false) SupportPriority priority,
      @RequestParam(value = "status", required = false) SupportStatus status) {
    if (ticketId == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ticket id is required");
    }
    if (category == null && type == null && priority == null && status == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid request");
    }
    if (status != null) {
      supportService.updateStatus(ticketId, status).getTicketResponse();
    }
    if (priority != null) {
      supportService.updatePriority(ticketId, priority).getTicketResponse();
    }
    if (category != null) {
      supportService.updateCategory(ticketId, category).getTicketResponse();
    }
    if (type != null) {
      supportService.updateType(ticketId, type).getTicketResponse();
    }
    SupportTicketResponse ticket = supportService.getTicket(ticketId).getTicketResponse();
    String createdBy = systemAdminService.getOne(userDetails.getId())
        .getFirstName(); // temporary
    supportActionService.createSupportAction(userDetails.getId(), ticket.getId(),
        "Ticket Updated",
        String.format("Ticket updated by %s", createdBy));
    return ResponseEntity.ok().body(ticket);
  }

  @Tag(name = "Comment", description = "Support Ticket Comment Management, **Role:**`SYSTEMADMIN`")
  @Operation(summary = "Add a comment to a support ticket", description = "**Role:**`SYSTEMADMIN`")
  @PostMapping("/ticket/comment/create")
  public ResponseEntity<SupportTicketResponse> addComment(@RequestBody CreateComment request,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    commentService.createComment(userDetails.getId(), request.getTicketId(),
        request.getMessage());
    return ResponseEntity.ok()
        .body(supportService.getTicket(request.getTicketId()).getTicketResponse());
  }

  @Tag(name = "Comment", description = "Support Ticket Comment Management, **Role:**`SYSTEMADMIN`")
  @Operation(summary = "Toggle a comment's visibility", description = "**Role:**`SYSTEMADMIN`")
  @PutMapping("/ticket/comment/toggle/{commentId}")
  public ResponseEntity<SupportTicketResponse> toggleCommentVisibility(
      @PathVariable("commentId") Long commentId, @RequestParam("ticketId") Long ticketId) {
    commentService.toggleCommentVisibility(commentId);
    return ResponseEntity.ok().body(supportService.getTicket(ticketId).getTicketResponse());
  }

  @Tag(name = "Comment", description = "Support Ticket Comment Management, **Role:**`SYSTEMADMIN`")
  @Operation(summary = "Delete a comment", description = "**Role:**`SYSTEMADMIN` Permenantly deletes a comment")
  @DeleteMapping("/ticket/comment/delete/{commentId}")
  public ResponseEntity<SupportTicketResponse> deleteComment(
      @PathVariable("commentId") Long commentId, @RequestParam("ticketId") Long ticketId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    commentService.permanentlyDeleteComment(commentId);
    SupportTicketResponse ticket = supportService.getTicket(ticketId).getTicketResponse();
    return ResponseEntity.ok().body(ticket);
  }

  @Tag(name = "Comment", description = "Support Ticket Comment Management, **Role:**`SYSTEMADMIN`")
  @Operation(summary = "Get all Authenticated user's comments", description = "**Role:**`SYSTEMADMIN`")
  @GetMapping("/ticket/comments")
  public ResponseEntity<Page<SupportComments>> getAllComments(Pageable pageable,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ResponseEntity.ok()
        .body(commentService.getCommentsByUserId(userDetails.getId(), pageable));
  }

  @Tag(name = "Comment", description = "Support Ticket Comment Management, **Role:**`SYSTEMADMIN`")
  @Operation(summary = "Edit a comment", description = "**Role:**`SYSTEMADMIN`")
  @PutMapping("/ticket/comment/edit/{commentId}")
  public ResponseEntity<SupportTicketResponse> editComment(
      @PathVariable("commentId") Long commentId, @RequestBody CreateComment request) {
    commentService.updateComment(commentId, request.getMessage());
    return ResponseEntity.ok()
        .body(supportService.getTicket(request.getTicketId()).getTicketResponse());
  }

  @Operation(summary = "Manually create a support action", description = "**Role:**`SYSTEMADMIN`")
  @PostMapping("/ticket/action/create")
  public ResponseEntity<SupportTicketResponse> createSupportAction(
      @RequestBody CreateAction request,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    supportActionService.createSupportAction(userDetails.getId(), request.getTicketId(),
        request.getAction(), request.getMessage());

    return ResponseEntity.ok()
        .body(supportService.getTicket(request.getTicketId()).getTicketResponse());
  }

  @Operation(summary = "Mark a ticket as resolved", description = "**Role:**`SYSTEMADMIN` Sets the status if the ticket to `RESOLVED` and the status of the inquiry to `RESOLVED` and notify the user that the ticket has been resolved")
  @PutMapping("/ticket/resolve/{ticketId}")
  public ResponseEntity<SupportTicketResponse> resolveTicket(
      @PathVariable("ticketId") Long ticketId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    String resolvedBy = systemAdminService.getOne(userDetails.getId())
        .getFirstName(); // temporary

    supportService.resolveTicket(ticketId);
    SupportTicketResponse ticket = supportService.getTicket(ticketId).getTicketResponse();
    supportActionService.createSupportAction(userDetails.getId(), ticket.getId(),
        "Ticket Resolved",
        String.format("Ticket resolved by %s", resolvedBy));
    return ResponseEntity.ok().body(ticket);
  }

  @Operation(summary = "Add tag to a ticket", description = "**Role:**`SYSTEMADMIN` Adds a tag to a ticket")
  @PutMapping("/ticket/tag/add/{ticketId}")
  public ResponseEntity<SupportTicketResponse> addTagToTicket(
      @PathVariable("ticketId") Long ticketId,
      @RequestParam("tag") String tag,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    supportService.addTag(ticketId, tag);
    SupportTicketResponse ticket = supportService.getTicket(ticketId).getTicketResponse();
    supportActionService.createSupportAction(userDetails.getId(), ticket.getId(),
        "Tag Added",
        String.format("Tag %s added to ticket", tag));
    return ResponseEntity.ok().body(ticket);
  }

  @Operation(summary = "Remove tag from a ticket", description = "**Role:**`SYSTEMADMIN` Removes a tag from a ticket")
  @PutMapping("/ticket/tag/remove/{ticketId}")
  public ResponseEntity<SupportTicketResponse> removeTagFromTicket(
      @PathVariable("ticketId") Long ticketId,
      @RequestParam("tag") String tag,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    supportService.removeTag(ticketId, tag);
    SupportTicketResponse ticket = supportService.getTicket(ticketId).getTicketResponse();
    supportActionService.createSupportAction(userDetails.getId(), ticket.getId(),
        "Tag Removed",
        String.format("Tag %s removed from ticket", tag));
    return ResponseEntity.ok().body(ticket);
  }
}
