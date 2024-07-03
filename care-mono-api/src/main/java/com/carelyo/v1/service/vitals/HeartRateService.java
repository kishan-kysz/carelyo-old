package com.carelyo.v1.service.vitals;

import com.carelyo.v1.dto.vitals.VitalsDTO.CreateHeartRate;
import com.carelyo.v1.model.vitals.HeartRate;
import com.carelyo.v1.repos.vitals.HeartRateRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class HeartRateService {

  private final HeartRateRepository heartRateRepository;

  public HeartRateService(HeartRateRepository heartRateRepository) {
    this.heartRateRepository = heartRateRepository;
  }

  public List<HeartRate> getAllHeartRateByUserId(Long userId) {
    return heartRateRepository.findAllByUserId(userId);
  }

  public List<HeartRate> getAllHeartRate() {
    return heartRateRepository.findAll();
  }

  public void createHeartRate(CreateHeartRate createHeartRateDTO, Long userId, Long childId) {
    HeartRate heartRate = new HeartRate(
        userId,
        createHeartRateDTO.getDate(),
        createHeartRateDTO.getHeartRateBpm(),
        childId);

    heartRateRepository.save(heartRate);
  }

  public List<HeartRate> getAllHeartRateByUserIdAndChildId(Long userId, Long childId) {
    if(childId != null) {
      return heartRateRepository.findByChildId(childId);
    } else {
      return heartRateRepository.findByUserIdAndChildId(userId, null);
    }
  }
}
