package com.carelyo.v1.model.support;

import com.carelyo.v1.dto.support.InquiryDto.InquiryResponse;
import com.carelyo.v1.model.BaseModel;
import com.carelyo.v1.model.user.User;
import com.carelyo.v1.utils.enums.SupportEnums.SupportStatus;
import java.time.LocalDateTime;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Log4j2
public class SupportInquiry extends BaseModel {

  @ManyToOne
  private User issuer;
  private String issuerName;
  private String subject;
  private String message;
  @Enumerated(EnumType.STRING)
  private SupportStatus status;
  private LocalDateTime resolvedAt;

  public InquiryResponse getResponse(List<String> images) {
    return new InquiryResponse(this, images);
  }


}
