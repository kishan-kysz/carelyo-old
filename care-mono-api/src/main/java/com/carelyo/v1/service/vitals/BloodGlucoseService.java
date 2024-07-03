package com.carelyo.v1.service.vitals;

import com.carelyo.v1.dto.vitals.VitalsDTO.CreateBloodGlucose;
import com.carelyo.v1.model.vitals.BloodGlucose;
import com.carelyo.v1.repos.vitals.BloodGlucoseRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class BloodGlucoseService {

  private final BloodGlucoseRepository bloodGlucoseRepository;

  public BloodGlucoseService(BloodGlucoseRepository bloodGlucoseRepository) {
    this.bloodGlucoseRepository = bloodGlucoseRepository;
  }

  public List<BloodGlucose> getAllBloodGlucoseByUserId(Long userId) {
    return bloodGlucoseRepository.findAllByUserId(userId);
  }

  public List<BloodGlucose> getAllBloodGlucose() {
    return bloodGlucoseRepository.findAll();
  }

  public void createBloodGlucose(CreateBloodGlucose createBloodGlucoseDTO, Long userId,
      Long childId) {
    BloodGlucose bloodGlucose = new BloodGlucose(
        userId,
        createBloodGlucoseDTO.getDate(),
        createBloodGlucoseDTO.getBloodGlucoseMmolPerL(),
        createBloodGlucoseDTO.getMealTime(),
        childId);

    bloodGlucoseRepository.save(bloodGlucose);
  }

  public List<BloodGlucose> getBloodGlucoseByUserIdAndChildId(Long userId, Long childId) {
    if(childId != null) {
      return bloodGlucoseRepository.findByChildId(childId);
    } else {
      return bloodGlucoseRepository.findByUserIdAndChildId(userId, null);
    }
  }
}
