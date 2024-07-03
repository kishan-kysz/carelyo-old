package com.carelyo.v1.service.patient;

import com.carelyo.v1.dto.patient.PatientDTO.CreateRelationshipDTO;
import com.carelyo.v1.dto.patient.PatientDTO.UpdateRelationshipDTO;
import com.carelyo.v1.model.user.patient.Patient;
import com.carelyo.v1.model.user.patient.Relationship;
import com.carelyo.v1.repos.user.RelationshipRepository;
import com.carelyo.v1.service.security.services.UserDetailsImpl;
import com.carelyo.v1.utils.AppUtils;
import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RelationshipService {
  private final RelationshipRepository relationshipRepository;
  private final PatientService patientService;

  public RelationshipService(RelationshipRepository relationshipRepository,
      PatientService patientService) {
    this.relationshipRepository = relationshipRepository;
    this.patientService = patientService;
  }

  public Relationship getRelationshipById(Long id) {
    return relationshipRepository.findById(id).orElseThrow(() -> new RuntimeException("Relationship not found"));
  }

  public void save(Relationship relationship) {
    relationshipRepository.save(relationship);
  }

  public boolean isNotPatientsRelationship(Long userId, Long relationshipId) {
    if (!patientService.isPatientByUserId(userId)) {
      return true;
    }

    Patient patient = patientService.getPatientByUserId(userId);
    return patient.getRelationships().stream()
        .noneMatch(relationship -> relationship.getId().equals(relationshipId));
  }

  public void createRelationship(Long userId, CreateRelationshipDTO createRelationshipDTO, UserDetailsImpl userDetails) {
    if (!AppUtils.hasRole(userDetails, "SYSTEMADMIN") &&
        !Objects.equals(userId, userDetails.getId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to do this");
    }

    if (Objects.equals(userId, createRelationshipDTO.getRelatedUserId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot create a relationship with yourself");
    }

    Patient patient = patientService.getPatientByUserId(userId);
    patientService.getPatientByUserId(createRelationshipDTO.getRelatedUserId());

    Relationship relationship = new Relationship(
        createRelationshipDTO.getRelation(),
        createRelationshipDTO.getType(),
        createRelationshipDTO.getRelatedUserId(),
        createRelationshipDTO.getAccess(),
        createRelationshipDTO.getCanLogin(),
        createRelationshipDTO.getAccessOptions()
    );

    patient.getRelationships().add(relationship);
    patientService.save(patient);
  }

  public void updateRelationship(Long id, UpdateRelationshipDTO updateRelationshipDTO, UserDetailsImpl userDetails) {
    if (!AppUtils.hasRole(userDetails, "SYSTEMADMIN") && isNotPatientsRelationship(
        userDetails.getId(), id)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to do this");
    }

    Relationship relationship = getRelationshipById(id);

    if (updateRelationshipDTO.getRelation() != null) {
      relationship.setRelation(updateRelationshipDTO.getRelation());
    }
    if (updateRelationshipDTO.getType() != null) {
      relationship.setType(updateRelationshipDTO.getType());
    }
    if (updateRelationshipDTO.getAccess() != null) {
      relationship.setAccess(updateRelationshipDTO.getAccess());
    }
    if (updateRelationshipDTO.getCanLogin() != null) {
      relationship.setCanLogin(updateRelationshipDTO.getCanLogin());
    }
    if (updateRelationshipDTO.getAccessOptions() != null) {
      relationship.setAccessOptions(updateRelationshipDTO.getAccessOptions());
    }

    save(relationship);
  }
}
