package com.carelyo.v1.model.user;

import com.carelyo.v1.model.BaseModel;
import javax.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Partner extends BaseModel {

  private String firstName;
  private String lastName;
  private String nationalIdNumber;
  private String mobile;
  private String email;

}
