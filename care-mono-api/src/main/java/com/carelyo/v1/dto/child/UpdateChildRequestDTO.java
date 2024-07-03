package com.carelyo.v1.dto.child;

import com.carelyo.v1.model.user.patient.Polygenic;
import java.util.Date;
import java.util.List;
import lombok.Value;
import org.springframework.web.multipart.MultipartFile;

@Value
public class UpdateChildRequestDTO {

  Long childId;
  String name;
  Date dateOfBirth;
  MultipartFile birthCertificate;
  Polygenic polygenic;
  private List<String> allergies;
  private List<String> medicalProblems;
  private List<String> disabilities;
  private PartnerDTO partner;

}
