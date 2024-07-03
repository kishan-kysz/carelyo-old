package com.carelyo.v1.controllers.template;

import com.carelyo.v1.dto.template.TemplateDTO;
import com.carelyo.v1.dto.template.TemplateDTO.Response;
import com.carelyo.v1.enums.ETemplateTypes;
import com.carelyo.v1.model.template.Template;
import com.carelyo.v1.service.template.TemplateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/templates")
@Tag(name = "Template", description = "**Role:** `SYSTEMADMIN` `PATIENT` `DOCTOR`")
public class TemplateController {

  private final TemplateService templateService;

  public TemplateController(TemplateService templateService) {
    this.templateService = templateService;
  }

  @Operation(summary = "Get a template", description = "**Role:** `SYSTEMADMIN`")
  @GetMapping("/{type}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<Response> getTemplate(@PathVariable("type") ETemplateTypes type) {
    return ResponseEntity.ok(templateService.getTemplate(type).getResponseDTO());
  }

  @Operation(summary = "Get all templates", description = "**Role:** `SYSTEMADMIN`")
  @GetMapping
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<List<Response>> getAllTemplates() {
    return ResponseEntity.ok(templateService.getAllTemplates().stream().map(
        Template::getResponseDTO).collect(Collectors.toList()));
  }

  @Operation(summary = "Update a template", description = "**Role:** `SYSTEMADMIN`")
  @PutMapping("/update/{type}")
  @PreAuthorize("hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<String> updateTemplate(@PathVariable("type") ETemplateTypes type,
      @Valid @RequestBody TemplateDTO.Update templateDTO) throws IOException {
    templateService.updateTemplate(type, templateDTO);
    return ResponseEntity.ok().body("Template has been updated");
  }
}
