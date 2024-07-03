package com.carelyo.v1.model.role;

import com.carelyo.v1.model.BaseModel;
import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Role data
 */

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Role extends BaseModel implements Serializable {

  @Column(length = 20, unique = true)
  @Enumerated(EnumType.STRING)
  private ERole name;

  public Role(ERole name) {
    this.name = name;
  }

}
