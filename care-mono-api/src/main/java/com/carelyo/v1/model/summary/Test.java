package com.carelyo.v1.model.summary;

import com.carelyo.v1.model.BaseModel;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Test extends BaseModel {

  @Column(unique = true)
  private String category;
  @ElementCollection(fetch = FetchType.LAZY)
  private Set<String> procedures;

}