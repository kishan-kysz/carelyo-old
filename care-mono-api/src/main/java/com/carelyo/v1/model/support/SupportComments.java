package com.carelyo.v1.model.support;

import com.carelyo.v1.model.BaseModel;
import javax.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class SupportComments extends BaseModel {

  Long userId;
  String message;
  Long ticketId;
  Boolean hidden = false;
}
