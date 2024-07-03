package com.carelyo.v1.service.consultation;

import com.carelyo.v1.dto.summary.LabrequestDTO;
import com.carelyo.v1.dto.summary.LabrequestDTO.createLabrequest;
import com.carelyo.v1.model.consultation.Consultation;
import com.carelyo.v1.model.summary.Labrequest;
import com.carelyo.v1.repos.summary.LabrequestRepository;
import com.carelyo.v1.utils.ModelSorter;
import java.util.List;
import java.util.Optional;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class LabrequestService {

  LabrequestRepository labrequestRepository;
  ConsultationService consultationService;

  public LabrequestService(LabrequestRepository labrequestRepository,
      ConsultationService consultationService) {
    this.labrequestRepository = labrequestRepository;
    this.consultationService = consultationService;
  }


  public List<Labrequest> getAllLabrequest() {
    return labrequestRepository.findAll();
  }

  public Labrequest createLabrequest(createLabrequest labrequest, Consultation consultation) {
    Labrequest lab = new Labrequest();
    lab.setReason(labrequest.getReason());
    lab.setTest(labrequest.getTest());
    lab.setConsultationId(consultation.getId());
    lab.setPatientId(consultation.getPatientId());
    lab.setDoctorId(consultation.getDoctorId());
    lab.setDoctorName(consultation.getDoctorFullName());
    lab.setPatientName(consultation.getPatientFullName());
    if(consultation.isChild()) {
      lab.setChildId(consultation.getChildId());
    }

    return labrequestRepository.save(lab);

  }


  public Labrequest getLabrequest(Long id) {
    return labrequestRepository.findById(id)
        .orElseThrow(ResourceNotFoundException::new);
  }

  public Labrequest updateLabrequest(LabrequestDTO.updateLabrequest labrequestDTO) {

    Labrequest labrequest = getLabrequest(labrequestDTO.getId());

    labrequest.setReason(labrequestDTO.getReason());
    labrequest.setTest(labrequestDTO.getTest());

    return labrequestRepository.save(labrequest);
  }

  public List<Labrequest> getLabsByPatientId(Long patientId) {
    return labrequestRepository.findByPatientId(patientId);

  }

  public List<Labrequest> getLabsByConsultationIdAndPatientId(Long consultationId,
      Long patientId) {
    List<Labrequest> labs = labrequestRepository.findByConsultationIdAndPatientIdAndChildId(consultationId, patientId, null);
    return new ModelSorter<>(labs).sortModelByTimeCreated();
  }

  public List<Labrequest> getLabsByConsultationIdAndChildId(Long consultationId,
      Long childId) {
    List<Labrequest> labs = labrequestRepository.findByConsultationIdAndChildId(consultationId, childId);
    return new ModelSorter<>(labs).sortModelByTimeCreated();
  }

  public Optional<Labrequest> getLabrequestByConsultationId(Long consultationId) {

    return labrequestRepository.findByConsultationId(consultationId);
  }

  public void deleteLabrequest(Long id) {
    labrequestRepository.deleteById(id);
  }
}
