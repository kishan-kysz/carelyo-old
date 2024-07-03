package com.carelyo.v1.service.vitals;

import com.carelyo.v1.dto.vitals.VitalsDTO.CreateBloodPressure;
import com.carelyo.v1.model.vitals.BloodPressure;
import com.carelyo.v1.repos.vitals.BloodPressureRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class BloodPressureService {

  private final BloodPressureRepository bloodPressureRepository;

  public BloodPressureService(BloodPressureRepository bloodPressureRepository) {
    this.bloodPressureRepository = bloodPressureRepository;
  }

  public List<BloodPressure> getAllBloodPressureByUserId(Long userId) {
    return bloodPressureRepository.findAllByUserId(userId);
  }

  public List<BloodPressure> getAllBloodPressure() {
    return bloodPressureRepository.findAll();
  }

  public void createBloodPressure(CreateBloodPressure createBloodPressureDTO, Long userId,
      Long childId) {
    BloodPressure bloodPressure = new BloodPressure(
        userId,
        createBloodPressureDTO.getDate(),
        createBloodPressureDTO.getSystolicMmHg(),
        createBloodPressureDTO.getDiastolicMmHg(),
        createBloodPressureDTO.getPosture(),
        childId);

    bloodPressureRepository.save(bloodPressure);
  }

  public List<BloodPressure> getAllBloodPressureByUserIdAndChildId(Long userId, Long childId) {
    if(childId != null) {
      return bloodPressureRepository.findByChildId(childId);
    } else {
      return bloodPressureRepository.findByUserIdAndChildId(userId, null);
    }
  }
}