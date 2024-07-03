package com.carelyo.v1.model.support;

import com.carelyo.v1.model.BaseModel;
import javax.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SupportActions extends BaseModel {

  Long userId;
  Long ticketId;
  String action;
  String message;

}
