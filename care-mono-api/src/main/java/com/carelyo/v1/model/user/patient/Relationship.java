package com.carelyo.v1.model.user.patient;

import com.carelyo.v1.enums.ERelationshipAccessOptions;
import com.carelyo.v1.enums.ERelationshipRelation;
import com.carelyo.v1.enums.ERelationshipType;
import com.carelyo.v1.model.BaseModel;
import java.util.List;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Relationship extends BaseModel {
  @Enumerated(EnumType.STRING)
  private ERelationshipRelation relation;
  @Enumerated(EnumType.STRING)
  private ERelationshipType type;
  private Long relatedUserId;
  private Boolean access;
  private Boolean canLogin;
  @ElementCollection(targetClass = ERelationshipAccessOptions.class)
  @Enumerated(EnumType.STRING)
  private List<ERelationshipAccessOptions> accessOptions;

  public Relationship(ERelationshipRelation relation, Long relatedUserId) {
    this.relation = relation;
    this.relatedUserId = relatedUserId;
  }
}
