package com.carelyo.v1.service.consultation;

import com.carelyo.v1.dto.summary.TestDTO;
import com.carelyo.v1.model.summary.Test;
import com.carelyo.v1.repos.summary.TestRepository;
import java.util.HashSet;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TestService {

  private final TestRepository testRepository;

  public TestService(TestRepository testRepository) {
    this.testRepository = testRepository;
  }

  public boolean existsByCategory(String category) {
    return testRepository.findByCategory(category).isPresent();
  }

  public List<Test> getAllTests() {
    return testRepository.findAll();
  }

  public void addTest(TestDTO.AddTest testDTO) {
    if (!existsByCategory(testDTO.getCategory())) {
      addCategory(testDTO.getCategory());
    }

    addTestToCategory(testDTO.getCategory(), testDTO.getProcedure());
  }

  public void updateTest(Long id, TestDTO testDTO) {
    Test test = testRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Test not found"));
    if (!existsByCategory(testDTO.getCategory())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Test category does not exist");
    }
    test.setCategory(testDTO.getCategory());
    test.setProcedures(testDTO.getProcedures());
    testRepository.save(test);
  }

  public void deleteTest(Long id) {
    Test test = testRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Test not found"));
    testRepository.delete(test);
  }

  public void addCategory(String category) {
    if (existsByCategory(category)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Test category already exists");
    }

    Test test = new Test(category, new HashSet<>());
    testRepository.save(test);
  }

  public void addTestToCategory(String category, String test) {
    Test testCategory = testRepository.findByCategory(category)
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Test category not found"));

    if (testCategory.getProcedures().contains(test)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Test already exists in category");
    }

    testCategory.getProcedures().add(test);
    testRepository.save(testCategory);
  }
}
