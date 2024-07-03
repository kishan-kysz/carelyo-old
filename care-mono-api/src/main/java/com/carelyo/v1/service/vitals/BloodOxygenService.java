package com.carelyo.v1.service.vitals;

import com.carelyo.v1.dto.vitals.VitalsDTO.CreateBloodOxygen;
import com.carelyo.v1.model.vitals.BloodOxygen;
import com.carelyo.v1.repos.vitals.BloodOxygenRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class BloodOxygenService {

  private final BloodOxygenRepository bloodOxygenRepository;

  public BloodOxygenService(BloodOxygenRepository bloodOxygenRepository) {
    this.bloodOxygenRepository = bloodOxygenRepository;
  }

  public List<BloodOxygen> getAllBloodOxygenByUserId(Long userId) {
    return bloodOxygenRepository.findAllByUserId(userId);
  }

  public List<BloodOxygen> getAllBloodOxygen() {
    return bloodOxygenRepository.findAll();
  }

  public void createBloodOxygen(CreateBloodOxygen createBloodOxygenDTO, Long userId, Long childId) {
    BloodOxygen bloodOxygen = new BloodOxygen(
        userId,
        createBloodOxygenDTO.getDate(),
        createBloodOxygenDTO.getBloodOxygenPercentage(),
        childId);

    bloodOxygenRepository.save(bloodOxygen);
  }

  public List<BloodOxygen> getAllBloodOxygenByUserIdAndChildId(Long userId, Long childId) {
    if(childId != null) {
      return bloodOxygenRepository.findByChildId(childId);
    } else {
      return bloodOxygenRepository.findByUserIdAndChildId(userId, null);
    }
  }
}
