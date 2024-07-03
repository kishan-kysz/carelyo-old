package com.carelyo.v1.dto.child;

import com.carelyo.v1.dto.ValidationMessages;
import java.util.Date;
import javax.validation.constraints.NotEmpty;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ChildRequestDTO {

  @NotEmpty(message = ValidationMessages.IS_REQUIRED)
  private String name;
  @NotEmpty(message = ValidationMessages.IS_REQUIRED)
  private String gender;
  private Date dateOfBirth;
  private String partnerFirstName;
  private String partnerLastName;
  private String partnerNationalIdNumber;
  private String partnerPhoneNumber;
  private String partnerEmailId;
  private MultipartFile birthCertificate;
  private MultipartFile NINCard;
  private String birthCertFileName;
  private String ninCardFileName;
  private Boolean singleParent;
  public ChildRequestDTO(String name, String gender, Date dateOfBirth,
      String partnerFirstName, String partnerLastName, String partnerNationalIdNumber,
      String partnerPhoneNumber, String partnerEmailId, MultipartFile birthCertificate,
      MultipartFile ninCard, String birthCertFileName, String ninCardFileName) {
    this.name = name;
    this.gender = gender;
    this.dateOfBirth = dateOfBirth;
    this.partnerFirstName = partnerFirstName;
    this.partnerLastName = partnerLastName;
    this.partnerNationalIdNumber = partnerNationalIdNumber;
    this.partnerPhoneNumber = partnerPhoneNumber;
    this.partnerEmailId = partnerEmailId;
    this.birthCertificate = birthCertificate;
    this.NINCard = ninCard;
    this.birthCertFileName = birthCertFileName;
    this.ninCardFileName = ninCardFileName;
  }
}