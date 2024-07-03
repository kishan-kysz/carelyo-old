package com.carelyo.v1.utils;

import com.carelyo.v1.dto.consultation.ConsultationDTO;
import com.carelyo.v1.dto.consultation.ConsultationDTO.AcceptedConsultation;
import com.carelyo.v1.dto.consultation.ConsultationDTO.BaseConsultation;
import com.carelyo.v1.dto.consultation.ConsultationDTO.DoctorInfo;
import com.carelyo.v1.dto.consultation.ConsultationDTO.PatientInfo;
import com.carelyo.v1.dto.summary.ConsultationSummaryDTO;
import com.carelyo.v1.model.consultation.Consultation;
import com.carelyo.v1.model.user.child.Child;
import com.carelyo.v1.model.user.patient.Patient;
import com.carelyo.v1.service.consultation.SummaryService.CurrentSummary;
import java.sql.SQLException;
import java.util.List;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ConsultationDTOUtil {

  public ConsultationDTO.ConsultationResponse getResponseDTO(Consultation consultation) {
    try {
      return new ConsultationDTO.ConsultationResponse(
          consultation.getId(),
          consultation.getPatientFullName(),
          consultation.getPatientMobile(),
          consultation.getPatientId(),
          consultation.getDoctorFullName(),
          consultation.getDoctorId(),
          consultation.getBodyArea(),
          consultation.getTimeBooked(),
          consultation.getTimeAccepted(),
          consultation.getTimeStarted(),
          consultation.getTimeFinished(),
          consultation.getStatus(),
          consultation.getSymptoms(),
          consultation.getRelatedSymptoms(),
          consultation.getConsultationUrl(),
          consultation.getRoomName(),
          consultation.getTextDetailedDescription(),
          consultation.getAudioDetailedDescription(),
          consultation.getTransactionReference(),
          consultation.getAmountPaid(),
          consultation.getLanguage(),
          consultation.getSbar().getDiagnosis(),
          consultation.getDuration(),
          consultation.getSbar(),
          consultation.getConsultationType(),
          consultation.getPriceListName()
      );
    } catch (SQLException e) {
      System.out.println(e.getMessage());
      return null;
    }
  }

  public ConsultationDTO.FinishedConsultation getFinishedConsultationDTO(
      Consultation consultation) {
    try {
      return new ConsultationDTO.FinishedConsultation(
          consultation.getId(),
          consultation.getPatientFullName(),
          consultation.getDoctorFullName(),
          consultation.getBodyArea(),
          consultation.getTimeBooked(),
          consultation.getTimeAccepted(),
          consultation.getTimeStarted(),
          consultation.getTimeFinished(),
          consultation.getSymptoms(),
          consultation.getRelatedSymptoms(),
          consultation.getTextDetailedDescription(),
          consultation.getAudioDetailedDescription(),
          consultation.getAmountPaid(),
          consultation.getSbar().getDiagnosis());
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return null;
    }
  }

  public ConsultationDTO.AcceptedConsultation createAcceptedDTO(Consultation consultation,
      Patient patient, List<ConsultationSummaryDTO> summary, CurrentSummary current,
      List<String> images) {
    try {
      ConsultationDTO.AcceptedConsultation response = new AcceptedConsultation();
      response.setConsultation(new BaseConsultation(consultation));
      response.setPatientInfo(new PatientInfo(
          consultation.getPatientFullName(),
          patient.getDateOfBirth(),
          consultation.getPatientId(),
          patient.getPolygenic().getGender(),
          patient.getLocation().getAddress(),
          patient.getLocation().getCommunity(),
          patient.getLocale().getLanguages(),
          patient.getPolygenic().getBloodType(),
          patient.getAllergies(),
          patient.getDisabilities(),
          patient.getPolygenic().getHeightCm(),
          patient.getPolygenic().getWeightKg(),
          patient.getMedicalProblems(),
          null,
          false
      ));
      response.setDoctor(
          new DoctorInfo(consultation.getDoctorFullName(), consultation.getDoctorId()));
      response.setHistory(summary);
      response.setCurrentConsultation(current);
      response.setImages(images);
      return response;


    } catch (Exception e) {
      System.out.println(e.getMessage());
      throw new RuntimeException("Error creating accepted consultation dto");
    }
  }

  public ConsultationDTO.AcceptedConsultation createAcceptedChildDTO(Consultation consultation,
      Patient patient,
      Child child, List<ConsultationSummaryDTO> summary, CurrentSummary current,
      List<String> images) {
    try {
      ConsultationDTO.AcceptedConsultation response = new AcceptedConsultation();
      response.setConsultation(new BaseConsultation(consultation));
      response.setPatientInfo(new PatientInfo(
          child.getName(),
          child.getDateOfBirth(),
          child.getId(),
          child.getPolygenic().getGender(),
          patient.getLocation().getAddress(),
          patient.getLocation().getCommunity(),
          patient.getLocale().getLanguages(),
          child.getPolygenic().getBloodType(),
          child.getAllergies(),
          child.getDisabilities(),
          child.getPolygenic().getHeightCm(),
          child.getPolygenic().getWeightKg(),
          child.getMedicalProblems(),
          consultation.getPatientFullName(),
          true
      ));
      response.setDoctor(
          new DoctorInfo(consultation.getDoctorFullName(), consultation.getDoctorId()));
      response.setHistory(summary);
      response.setCurrentConsultation(current);
      response.setImages(images);
      return response;

    } catch (Exception e) {
      System.out.println(e.getMessage());
      throw new RuntimeException("Error creating accepted consultation dto");
    }
  }
}
