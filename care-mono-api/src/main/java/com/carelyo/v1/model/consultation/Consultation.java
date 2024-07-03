package com.carelyo.v1.model.consultation;

import com.carelyo.v1.dto.consultation.ConsultationDTO;
import com.carelyo.v1.dto.consultation.SbarDTO;
import com.carelyo.v1.enums.EConsultationStatus;
import com.carelyo.v1.enums.EConsultationType;
import com.carelyo.v1.model.BaseModel;
import com.carelyo.v1.model.summary.FollowUp;
import com.carelyo.v1.utils.ConsultationDTOUtil;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.OneToOne;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Consultation extends BaseModel {

  public final static Comparator<Consultation> timeAcceptedComparator = Comparator
      .comparing(Consultation::getTimeAccepted);
  public final static Comparator<Consultation> timeBookedComparator = Comparator
      .comparing(Consultation::getTimeBooked);
  public final static Comparator<Consultation> timeFinishedComparator = Comparator
      .comparing(Consultation::getTimeFinished);

  private String patientFullName;
  private Long patientId;
  private String patientMobile;
  @Column(nullable = false)
  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(name = "consultation_body_area", joinColumns = @JoinColumn(name = "consultation_id"))
  @Size(min = 1, max = 2)
  private Set<String> bodyArea = new HashSet<>();
  @Column(nullable = false)
  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(name = "consultation_symptoms", joinColumns = @JoinColumn(name = "consultation_id"))
  private Set<String> symptoms = new HashSet<>();
  @Column(nullable = false)
  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(name = "consultation_related_symptoms", joinColumns = @JoinColumn(name = "consultation_id"))
  private Set<String> relatedSymptoms = new HashSet<>();
  @Lob
  private String textDetailedDescription;
  @Lob
  private Blob audioDetailedDescription;
  private String transactionReference;
  private String transactionUrl;
  private String clientSecret;
  private String paymentProvider;
  private String language;


  private String priceListName;
  private String amountPaid;
  private Double duration;
  private Integer rating;


  private String doctorFullName;
  private Long doctorId;
  private String consultationUrl;
  private String roomName;
  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "sbar_id", referencedColumnName = "id")
  private ConsultationSBAR sbar = new ConsultationSBAR();

  @Enumerated(EnumType.STRING)
  private EConsultationStatus status;
  private LocalDateTime timeBooked;
  private LocalDateTime timeAccepted;
  private LocalDateTime timeStarted;
  private LocalDateTime timeFinished;
  private LocalDateTime timeRetained;

  private boolean isChild;
  private Long childId;

  @Enumerated(EnumType.STRING)
  private EConsultationType consultationType;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "follow_up_id", referencedColumnName = "id")
  private FollowUp followUp;

  public Consultation(Long patientId, Set<String> bodyArea) {
    this.patientId = patientId;
    this.bodyArea = bodyArea;
    this.timeBooked = LocalDateTime.now();
    this.status = EConsultationStatus.booked;
  }

  public byte[] getAudioDetailedDescription() throws SQLException {
    if (audioDetailedDescription != null) {
      return audioDetailedDescription.getBytes(1, (int) audioDetailedDescription.length());
    } else {
      return new byte[]{};
    }
  }

  public boolean getAcceptedConsultations() {
    return this.status.equals(EConsultationStatus.accepted);
  }

  public ConsultationDTO.ConsultationResponse getDto() {
    return ConsultationDTOUtil.getResponseDTO(this);

  }

  public ConsultationDTO.BookedConsultationForChild getChildConsultations() {
      return new ConsultationDTO.BookedConsultationForChild(
              this.getId(),
              this.getStatus(),
              this.getTimeBooked(),
              this.getTimeAccepted(),
              this.getTimeStarted(),
              this.getTimeFinished(),
              this.getTransactionReference(),
              this.getTransactionUrl(),
              this.getDuration(),
              this.getPatientId(),
              this.getPatientFullName(),
              this.getPriceListName());
    }

    public void addSymptom(String symptom) {
        this.symptoms.add(symptom);
    }

  public void addRelatedSymptom(String symptom) {
    this.relatedSymptoms.add(symptom);
  }


  public void addBodyArea(String bodyArea) {
    this.bodyArea.add(bodyArea);
  }

  public void setSbar(SbarDTO sbar) {
    this.sbar = new ConsultationSBAR(sbar);
  }
}
