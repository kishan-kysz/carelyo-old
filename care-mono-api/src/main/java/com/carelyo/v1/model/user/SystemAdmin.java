package com.carelyo.v1.model.user;

import com.carelyo.v1.model.BaseModel;
import javax.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@NoArgsConstructor
public class SystemAdmin extends BaseModel {

  private Long userId;
  private String firstName;
  private String lastName;


  public SystemAdmin(Long userId, String firstName, String lastName) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
