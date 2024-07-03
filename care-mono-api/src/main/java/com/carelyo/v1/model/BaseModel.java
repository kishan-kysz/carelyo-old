package com.carelyo.v1.model;

import java.time.LocalDateTime;
import java.util.Comparator;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public abstract class BaseModel {

  public final static Comparator<BaseModel> timeCreatedComparator = Comparator.comparing(BaseModel::getCreatedAt)
      .reversed();
  public final static Comparator<BaseModel> timeUpdatedComparator = Comparator
      .comparing(BaseModel::getUpdatedAt);


  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @CreationTimestamp
  private LocalDateTime createdAt;
  @UpdateTimestamp
  private LocalDateTime updatedAt;

}
