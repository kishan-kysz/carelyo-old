package com.carelyo.v1.controllers.consultation;

import com.carelyo.v1.dto.summary.TestDTO;
import com.carelyo.v1.model.summary.Test;
import com.carelyo.v1.service.consultation.TestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Test", description = "`DOCTOR` `SYSTEMADMIN`")
@RequestMapping("/api/v1/tests")
public class TestController {

  private final TestService testService;

  public TestController(TestService testService) {
    this.testService = testService;
  }

  @Operation(summary = "Get all tests", description = "**Roles:**`DOCTOR` `PATIENT` `SYSTEMADMIN`")
  @GetMapping("/")
  public ResponseEntity<List<Test>> getAllTests() {
    return new ResponseEntity<>(testService.getAllTests(), HttpStatus.OK);
  }

  @Operation(summary = "Add test", description = "**Roles:**`DOCTOR` `SYSTEMADMIN`")
  @PostMapping("/add")
  public ResponseEntity<String> addTest(@Valid @RequestBody TestDTO.AddTest testDTO) {
    testService.addTest(testDTO);
    return ResponseEntity.status(HttpStatus.OK)
        .header("Content-Type", "application/json")
        .body("{\"message\":\"" + "Test added successfully" + "\"}");
  }

  @Operation(summary = "Update test", description = "**Roles:**`DOCTOR` `SYSTEMADMIN`")
  @PostMapping("/update/{id}")
  public ResponseEntity<String> updateTest(@PathVariable Long id, @Valid @RequestBody TestDTO testDTO) {
    testService.updateTest(id, testDTO);
    return ResponseEntity.status(HttpStatus.OK)
        .header("Content-Type", "application/json")
        .body("{\"message\":\"" + "Test updated successfully" + "\"}");
  }

  @Operation(summary = "Delete test", description = "**Roles:**`SYSTEMADMIN`")
  @PostMapping("/delete/{id}")
  public ResponseEntity<String> deleteTest(@PathVariable Long id) {
    testService.deleteTest(id);
    return ResponseEntity.status(HttpStatus.OK)
        .header("Content-Type", "application/json")
        .body("{\"message\":\"" + "Test deleted successfully" + "\"}");
  }

}
