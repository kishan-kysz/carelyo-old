package com.carelyo.v1.service.support;

import com.carelyo.v1.dto.support.SupportDto.CreateSupportTicket;
import com.carelyo.v1.dto.support.SupportDto.UpdateSupportTicket;
import com.carelyo.v1.dto.user.MessageDTO.CreateUserSpecificMessage;
import com.carelyo.v1.model.support.SupportInquiry;
import com.carelyo.v1.model.support.SupportTicket;
import com.carelyo.v1.model.user.SystemAdmin;
import com.carelyo.v1.repos.support.SupportTicketsRepository;
import com.carelyo.v1.service.user.MessageService;
import com.carelyo.v1.service.user.SystemAdminService;
import com.carelyo.v1.utils.enums.SupportEnums.Category;
import com.carelyo.v1.utils.enums.SupportEnums.SupportPriority;
import com.carelyo.v1.utils.enums.SupportEnums.SupportStatus;
import com.carelyo.v1.utils.enums.SupportEnums.SupportType;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@Slf4j
public class SupportService {

  private final InquiryService inquiryService;
  private final SupportTicketsRepository supportTicketsRepository;
  private final SystemAdminService systemAdminService;
  private final MessageService messageService;


  public SupportService(InquiryService inquiryService,
      SupportTicketsRepository supportTicketsRepository,
      SystemAdminService systemAdminService,
      MessageService messageService) {
    this.inquiryService = inquiryService;
    this.supportTicketsRepository = supportTicketsRepository;
    this.systemAdminService = systemAdminService;
    this.messageService = messageService;

  }

  public Page<SupportTicket> getTickets(Pageable pageable) {
    return supportTicketsRepository.findAll(pageable);
  }

  public Page<SupportTicket> getTicketsByUser(Long userId, Pageable pageable) {
    return supportTicketsRepository.findAllByAssigneeId(userId, pageable);
  }

  public SupportTicket createTicket(CreateSupportTicket entryDto) {
    SupportTicket entry = new SupportTicket();
    SupportInquiry inquiry = inquiryService.getInquiryById(entryDto.getInquiryId());
    inquiryService.changeInquiryStatus(inquiry, SupportStatus.Investigating);
    SystemAdmin createdBy = getAdminById(entryDto.getCreatedBy());
    SystemAdmin assignee = getAdminById(entryDto.getAssigneeId());
    entry.setInquiry(inquiry);
    entry.setCreatedBy(createdBy);
    entry.setCategory(entryDto.getCategory());
    entry.setType(entryDto.getType());
    entry.setPriority(entryDto.getPriority());
    entry.setStatus(SupportStatus.Open);
    entry.setAssignee(assignee);
    entry.setTags(entryDto.getTags());
    supportTicketsRepository.save(entry);
    return entry;
  }

  public SupportTicket updateTicket(UpdateSupportTicket entry) {
    Optional<SupportTicket> optTicket = findById(entry.getId());
    if (optTicket.isPresent()) {
      SupportTicket supportTicket = optTicket.get();
      supportTicket.setCategory(entry.getCategory());
      supportTicket.setType(entry.getType());
      supportTicket.setPriority(entry.getPriority());
      supportTicket.setStatus(entry.getStatus());
      supportTicket.setTags(entry.getTags());
      supportTicketsRepository.save(supportTicket);
      return supportTicket;
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found");
  }

  public SupportTicket updateStatus(Long id, SupportStatus status) {
    Optional<SupportTicket> optTicket = findById(id);
    if (optTicket.isPresent()) {
      SupportTicket entry = optTicket.get();
      entry.setStatus(status);
      supportTicketsRepository.save(entry);
      return entry;
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found");
  }

  public SupportTicket updatePriority(Long id, SupportPriority priority) {
    Optional<SupportTicket> optTicket = findById(id);
    if (optTicket.isPresent()) {
      SupportTicket entry = optTicket.get();
      entry.setPriority(priority);
      supportTicketsRepository.save(entry);
      return entry;
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found");
  }

  public SupportTicket updateCategory(Long id, Category category) {
    Optional<SupportTicket> optTicket = findById(id);
    if (optTicket.isPresent()) {
      SupportTicket entry = optTicket.get();
      entry.setCategory(category);
      supportTicketsRepository.save(entry);
      return entry;
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found");
  }

  public SupportTicket updateType(Long id, SupportType type) {
    Optional<SupportTicket> optTicket = findById(id);
    if (optTicket.isPresent()) {
      SupportTicket entry = optTicket.get();
      entry.setType(type);
      supportTicketsRepository.save(entry);
      return entry;
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found");
  }

  public SupportTicket assignTicket(Long id, Long assigneeId) {
    Optional<SupportTicket> optTicket = findById(id);
    if (optTicket.isPresent()) {
      SupportTicket entry = optTicket.get();
      SystemAdmin admin = getAdminById(assigneeId);
      entry.setAssignee(admin);
      supportTicketsRepository.save(entry);
      return entry;
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found");
  }

  public SupportTicket getTicket(Long entryId) {
    Optional<SupportTicket> optTicket = findById(entryId);
    if (optTicket.isPresent()) {
      return optTicket.get();
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found");
  }

  private Optional<SupportTicket> findById(Long id) {
    return supportTicketsRepository.findById(id);
  }

  private SystemAdmin getAdminById(Long id) {
    return systemAdminService.getByUserIdOptional(id).orElseThrow(
        () -> new ResponseStatusException(HttpStatus.NOT_FOUND,
            "Admin with that id does not exists"));
  }

  public void resolveTicket(Long ticketId) {
    Optional<SupportTicket> optTicket = findById(ticketId);
    if (optTicket.isPresent()) {
      SupportTicket entry = optTicket.get();
      updateStatus(ticketId, SupportStatus.Resolved);
      inquiryService.changeInquiryStatus(ticketId, SupportStatus.Resolved);
      CreateUserSpecificMessage message = new CreateUserSpecificMessage(
          "Your inquiry has been resolved!",
          String.format("%s %s", entry.getAssignee().getFirstName(),
              entry.getAssignee().getLastName()),
          "Hello {username}, We have reviewed your inquiry and have resolved it. Please feel free to contact us again if you have any further questions. Thank you for using Carelyo.",
          entry.getInquiry().getIssuer().getId()
      );
      messageService.createUserSpecificMessage(message);
    } else {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found");
    }
  }

  public void addTag(Long ticketId, String tag) {
    SupportTicket ticket = getTicket(ticketId);
    ticket.getTags().add(tag);
    supportTicketsRepository.save(ticket);
  }

  public void removeTag(Long ticketId, String tag) {
    SupportTicket ticket = getTicket(ticketId);
    ticket.getTags().remove(tag);
    supportTicketsRepository.save(ticket);
  }

  public SupportTicket unAssignTicket(Long ticketId) {
    SupportTicket ticket = getTicket(ticketId);
    ticket.setAssignee(null);
    return supportTicketsRepository.save(ticket);
  }
}
