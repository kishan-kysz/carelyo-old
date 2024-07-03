package com.carelyo.v1.model.user.doctor;

import com.carelyo.v1.dto.doctor.DoctorDTO;
import com.carelyo.v1.enums.EAccoladeTypes;
import com.carelyo.v1.model.BaseModel;
import javax.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Accolade extends BaseModel {

  private Long doctorId;
  private EAccoladeTypes name;
  private String description;
  private Long year;


  public Accolade(Long userId, DoctorDTO.CreateAccoladeDTO accoladeDTO) {
    this.doctorId = userId;
    this.name = EAccoladeTypes.valueOf(accoladeDTO.getName());
    this.description = accoladeDTO.getDescription();
    this.year = accoladeDTO.getYear();
  }

}
