package com.carelyo.v1.service.vitals;

import com.carelyo.v1.dto.vitals.VitalsDTO.CreateRespiratoryRate;
import com.carelyo.v1.model.vitals.RespiratoryRate;
import com.carelyo.v1.repos.vitals.RespiratoryRateRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class RespiratoryRateService {

  private final RespiratoryRateRepository respiratoryRateRepository;

  public RespiratoryRateService(RespiratoryRateRepository respiratoryRateRepository) {
    this.respiratoryRateRepository = respiratoryRateRepository;
  }

  public List<RespiratoryRate> getAllRespiratoryRateByUserId(Long userId) {
    return respiratoryRateRepository.findAllByUserId(userId);
  }

  public List<RespiratoryRate> getAllRespiratoryRate() {
    return respiratoryRateRepository.findAll();
  }

  public void createRespiratoryRate(CreateRespiratoryRate createRespiratoryRateDTO, Long userId,
      Long childId) {
    RespiratoryRate respiratoryRate = new RespiratoryRate(
        userId,
        createRespiratoryRateDTO.getDate(),
        createRespiratoryRateDTO.getBreathsPerMinute(),
        childId);

    respiratoryRateRepository.save(respiratoryRate);
  }

  public List<RespiratoryRate> getAllRespiratoryRateByUserIdAndChildId(Long userId, Long childId) {
    if(childId != null) {
      return respiratoryRateRepository.findByChildId(childId);
    } else {
      return respiratoryRateRepository.findByUserIdAndChildId(userId, null);
    }
  }
}
