package com.carelyo.v1.service.support;

import com.carelyo.v1.dto.support.InquiryDto.InquiryRequest;
import com.carelyo.v1.dto.support.InquiryDto.UpdateInquiryRequest;
import com.carelyo.v1.model.support.SupportInquiry;
import com.carelyo.v1.model.user.User;
import com.carelyo.v1.repos.support.InquiriesRepository;
import com.carelyo.v1.service.external.MinioAdapter;
import com.carelyo.v1.service.external.minio.Base64Ball;
import com.carelyo.v1.service.user.UserService;
import com.carelyo.v1.utils.enums.SupportEnums.SupportStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@Slf4j
public class InquiryService {

  private final InquiriesRepository inquiriesRepository;
  private final UserService userService;
  private final MinioAdapter minioAdapter;

  public InquiryService(InquiriesRepository inquiriesRepository, UserService userService,
      MinioAdapter minioAdapter) {
    this.inquiriesRepository = inquiriesRepository;
    this.userService = userService;
    this.minioAdapter = minioAdapter;
  }

  public Slice<SupportInquiry> getAllInquiries(Pageable pageable) {
    return inquiriesRepository.findAll(pageable);
  }

  public Slice<SupportInquiry> getAllInquiriesByStatus(SupportStatus status, Pageable pageable) {
    return inquiriesRepository.findAllByStatus(status, pageable);
  }

  public Slice<SupportInquiry> searchInquiries(String subject, Pageable pageable) {
    return inquiriesRepository.findAllBySubjectContaining(subject, pageable);
  }

  public Slice<SupportInquiry> getAllInquiriesByUser(Long userId, Pageable pageable) {
    return inquiriesRepository.findAllByIssuerId(userId, pageable);
  }

  public SupportInquiry createInquiry(Long issuerId, String issuerName, @NotNull InquiryRequest request) {
    User user = userService.findById(issuerId)
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    Optional<SupportInquiry> ticketWithExistingSubject = findInquiryWithExistingSubject(
        request.getSubject(), issuerId);
    Optional<SupportInquiry> ticketWithExistingMessage = findInquiryWithExistingMessage(
        request.getMessage(), issuerId);
    if (ticketWithExistingSubject.isPresent() || ticketWithExistingMessage.isPresent()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "A inquiry with this subject or message already exists");
    }
    SupportInquiry inquiry = new SupportInquiry();
    inquiry.setIssuer(user);
    inquiry.setStatus(SupportStatus.Open);
    inquiry.setSubject(request.getSubject());
    inquiry.setMessage(request.getMessage());
    inquiry.setIssuerName(issuerName);
    inquiriesRepository.save(inquiry);

    if (request.getImages() != null) {
      for (var image : request.getImages()) {
        Base64Ball ball = new Base64Ball(inquiry, image);
        try {
          minioAdapter.uploadObject(ball);
        } catch (Exception e) {
          log.error(e.getMessage());
        }
      }
    }
    return inquiry;
  }


  public SupportInquiry updateInquiry(Long issuerId, UpdateInquiryRequest request) {
    SupportInquiry inquiry = getInquiryById(request.getId());

    if (!inquiry.getIssuer().getId().equals(issuerId)) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
          "You are not authorized to update this inquiry");
    }
    inquiry.setSubject(request.getSubject());
    inquiry.setMessage(request.getMessage());
    return inquiriesRepository.save(inquiry);


  }


  public SupportInquiry changeInquiryStatus(Long id, SupportStatus status) {
    SupportInquiry inquiry = getInquiryById(id);
    return updateInquiryStatus(status, inquiry);
  }


  public void changeInquiryStatus(SupportInquiry inquiry, SupportStatus status) {
    updateInquiryStatus(status, inquiry);
  }


  public SupportInquiry getInquiryById(Long id) {
    Optional<SupportInquiry> ticket = findTicketById(id);
    if (ticket.isPresent()) {
      return ticket.get();
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Inquiry not found");
  }

  public List<String> getImagesUrls(Long inquiryId) {
    SupportInquiry inquiry = getInquiryById(inquiryId);
    try {
      return minioAdapter.getFilesURLs(inquiry);
    } catch (Exception e) {
      e.printStackTrace();
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "Could not find images for inquiry with id: " + inquiryId);
    }
  }

  private Optional<SupportInquiry> findInquiryWithExistingSubject(String subject, Long issuerId) {
    return inquiriesRepository.findBySubjectAndIssuerId(subject, issuerId);
  }

  private Optional<SupportInquiry> findInquiryWithExistingMessage(String message, Long issuer_id) {
    return inquiriesRepository.findByMessageAndIssuerId(message, issuer_id);
  }

  private Optional<SupportInquiry> findTicketById(Long id) {
    return inquiriesRepository.findById(id);
  }

  private SupportInquiry updateInquiryStatus(SupportStatus status, SupportInquiry inquiry) {
    if (inquiry.getStatus().equals(status)) {
      return inquiry;
    }
    if (inquiry.getStatus().equals(SupportStatus.Closed)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Inquiry is already closed");
    }
    if (inquiry.getStatus().equals(SupportStatus.Resolved)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "Inquiry is already resolved");
    }
    if (status.equals(SupportStatus.Closed) || status.equals(SupportStatus.Resolved)) {

      inquiry.setResolvedAt(LocalDateTime.now());
    }
    inquiry.setStatus(status);
    return inquiriesRepository.save(inquiry);
  }

}
