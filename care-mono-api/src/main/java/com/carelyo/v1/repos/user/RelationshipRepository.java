package com.carelyo.v1.repos.user;

import com.carelyo.v1.model.user.patient.Relationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RelationshipRepository extends JpaRepository<Relationship, Long> {

}