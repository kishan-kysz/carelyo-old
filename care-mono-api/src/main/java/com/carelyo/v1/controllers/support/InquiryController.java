package com.carelyo.v1.controllers.support;

import com.carelyo.v1.dto.support.InquiryDto.InquiryRequest;
import com.carelyo.v1.dto.support.InquiryDto.InquiryResponse;
import com.carelyo.v1.dto.support.InquiryDto.UpdateInquiryRequest;
import com.carelyo.v1.model.support.SupportInquiry;
import com.carelyo.v1.service.doctor.DoctorService;
import com.carelyo.v1.service.patient.PatientService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.service.support.InquiryService;
import com.carelyo.v1.utils.AppUtils;
import com.carelyo.v1.utils.enums.SupportEnums.SupportStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import javax.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

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
@Tag(name = "Inquiry", description = "Inquiry API, All endpoints uses the authenticated users details, Admins can use the userId to get inquiries created by other users")
@RequestMapping("/api/v1/inquiries")

public class InquiryController {

  private final InquiryService inquiryService;
  private final PatientService patientService;
  private final DoctorService doctorService;

  public InquiryController(InquiryService inquiryService,
      PatientService patientService,
      DoctorService doctorService) {
    this.inquiryService = inquiryService;
    this.patientService = patientService;
    this.doctorService = doctorService;
  }

  @GetMapping("/")
  @Operation(summary = "Get all inquiries", description = "**Role:**`SYSTEMADMIN` Get all inquiries, Returns a slice of inquiries")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public Slice<InquiryResponse> getAllInquiries(
      @RequestParam(value = "status", required = false) SupportStatus status, Pageable pageable) {
    if (status != null) {
      return inquiryService.getAllInquiriesByStatus(status, pageable).map((inquiry) -> {
        List<String> images = inquiryService.getImagesUrls(inquiry.getId());
        return inquiry.getResponse(images);
      });
    }
    return inquiryService.getAllInquiries(pageable).map((inquiry) -> {
      List<String> images = inquiryService.getImagesUrls(inquiry.getId());
      return inquiry.getResponse(images);
    });
  }

  @GetMapping("/user/{userId}")
  @PreAuthorize("isAuthenticated()")
  @Operation(summary = "Get all inquiries by user", description = "**Role:**`USER` `SYSTEMADMIN` Get all inquiries by user, Returns a slice of inquiries that belong to the user")
  public Slice<InquiryResponse> getAllInquiriesByUser(@PathVariable("userId") Long userId,
      Pageable pageable, @AuthenticationPrincipal UserDetailsImpl user) {
    if (!userId.equals(user.getId()) && !AppUtils.hasRole(user, "SYSTEMADMIN")) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You are not authorized to view this resource");
    }
    Long targetUserId = AppUtils.enforceTargetIfAdmin(userId, user);
    return inquiryService.getAllInquiriesByUser(targetUserId, pageable)
        .map((inquiry) -> {
          List<String> images = inquiryService.getImagesUrls(inquiry.getId());
          return inquiry.getResponse(images);
        });
  }

  @GetMapping("/search")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  @Operation(summary = "Search inquiries", description = "**Role:**`SYSTEMADMIN` Search inquiries by subject, Returns a slice of inquiries that match the search query")
  public Slice<InquiryResponse> searchInquiries(@RequestParam String query,
      Pageable pageable) {

    return inquiryService.searchInquiries(query, pageable).map((inquiry) -> {
      List<String> images = inquiryService.getImagesUrls(inquiry.getId());
      return inquiry.getResponse(images);
    });
  }

  @PostMapping("/create")
  @PreAuthorize("isAuthenticated()")
  @Operation(summary = "Create a support inquiry", description = "**Role:**`USER` A user can create a support inquiry, the inquiry can be updated by the user and admin can create tickets from the inquiry")
  public InquiryResponse createInquiry(@Valid @RequestBody InquiryRequest request,
      @AuthenticationPrincipal UserDetailsImpl user) {
    List<String> roles = AppUtils.getRoles(user);
    AtomicReference<String> issuerName = new AtomicReference<>(user.getUsername());
    if (roles.contains("PATIENT")) {
      patientService.getPatientById(user.getId())
          .ifPresent((patient) -> issuerName.set(patient.getFirstName() + " " + patient.getSurName()));
    } else if (roles.contains("DOCTOR")) {
      doctorService.getById(user.getId())
          .ifPresent((doctor) -> issuerName.set(doctor.getFirstName() + " " + doctor.getLastName()));
    }
    return inquiryService.createInquiry(user.getId(), issuerName.get(), request).getResponse(null);
  }

  @PutMapping("/update")
  @PreAuthorize("hasAnyAuthority('DOCTOR', 'PATIENT','SYSTEMADMIN')")
  @Operation(summary = "Updates a support inquiry", description = "**Role:**`USER` A user can update a support inquiry, the inquiry can be updated by the user and admin can create tickets from the inquiry")
  public InquiryResponse updateInquiry(@Valid @RequestBody UpdateInquiryRequest request,
      @AuthenticationPrincipal UserDetailsImpl user) {
    List<String> images = inquiryService.getImagesUrls(request.getId());
    return inquiryService.updateInquiry(user.getId(), request).getResponse(images);
  }

  @PutMapping("update/status/{id}")
  @Operation(summary = "Updates a support inquiry status", description = "**Role:**`SYSTEMADMIN` Updates a support inquiry status, to one of the following: `Open` `Closed``Viewed` `Deleted` `Investigating` `Resolved` Closed and resolved are final states ")
  public InquiryResponse updateInquiryStatus(@PathVariable("id") Long id,
      @RequestParam SupportStatus status) {
    List<String> images = inquiryService.getImagesUrls(id);
    return inquiryService.changeInquiryStatus(id, status).getResponse(images);
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('DOCTOR', 'PATIENT','SYSTEMADMIN')")
  @Operation(summary = "Get inquiry by id", description = "**Role:**`USER` `SYSTEMADMIN` Get inquiry by id, Returns a inquiry")
  public ResponseEntity<InquiryResponse> getInquiryById(@PathVariable("id") Long id,
      @AuthenticationPrincipal UserDetailsImpl user) {

    boolean isAdmin = AppUtils.hasRole(user, "SYSTEMADMIN");
    SupportInquiry inquiry = inquiryService.getInquiryById(id);
    List<String> images = inquiryService.getImagesUrls(inquiry.getId());
    if (!isAdmin && !inquiry.getIssuer().getId().equals(user.getId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "You are not authorized to view this resource");
    }

    return ResponseEntity.status(HttpStatus.OK).body(inquiry.getResponse(images));
  }
}
