package com.carelyo.v1.controllers.provider;

import com.carelyo.v1.dto.provider.ProviderFormDTO;
import com.carelyo.v1.dto.provider.ProviderInformationDTO;
import com.carelyo.v1.model.provider.Provider;
import com.carelyo.v1.service.provider.ProviderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Provider")
@RequestMapping("/api/v1/providers")
public class ProviderController {
  private final ProviderService providerService;

  public ProviderController(ProviderService providerService) {
    this.providerService = providerService;
  }

  @Operation(summary = "Get all providers", description = "**Role** `SYSTEMADMIN`")
  @GetMapping
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<Provider>> getAllProvider() {
    return ResponseEntity.ok(providerService.getAllProvider());

  }

  @Operation(summary = "Get all provider information", description = "**Role** `Patient`")
  @GetMapping("/headers")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('DOCTOR') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<ProviderInformationDTO>> getProviderHeaders() {
    return ResponseEntity.ok(providerService.getProviderHeaders());
  }

  @Operation(summary = "Create provider", description = "**Role** `SYSTEMADMIN`")
  @PostMapping("/create")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<?> postProvider(@RequestBody ProviderFormDTO providerFormDTO) {

    return ResponseEntity.ok(providerService.postProvider(providerFormDTO));

  }

  @Operation(summary = "Get specific provider", description = "**Role** `SYSTEMADMIN`")
  @GetMapping("/{id}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN') or hasAuthority('PATIENT') or hasAuthority('DOCTOR')")
  public ResponseEntity<?> getSpecificProvider(@PathVariable Long id) {
    return ResponseEntity.ok()
        .body(providerService.getSpecificprovider(id));
  }

  @Operation(summary = "Update provider", description = "**Role** `SYSTEMADMIN`")
  @PutMapping("/update/{id}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<?> updateProvider(
      @PathVariable long id,
      @RequestBody ProviderFormDTO dto) {
    return ResponseEntity.ok(providerService.update(id, dto));
  }

  @Operation(summary = "Delete provider", description = "**Role** `SYSTEMADMIN`")
  @DeleteMapping("/delete/{id}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<String> deleteProvider(@PathVariable Long id) {
    providerService.delete(id);
    return ResponseEntity.ok()
        .body("Provider is deleted");

  }

}
