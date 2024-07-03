package com.carelyo.v1.service.vitals;

import com.carelyo.v1.dto.vitals.VitalsDTO.CreateBodyTemperature;
import com.carelyo.v1.model.vitals.BodyTemperature;
import com.carelyo.v1.repos.vitals.BodyTemperatureRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class BodyTemperatureService {

  private final BodyTemperatureRepository bodyTemperatureRepository;

  public BodyTemperatureService(BodyTemperatureRepository bodyTemperatureRepository) {
    this.bodyTemperatureRepository = bodyTemperatureRepository;
  }

  public List<BodyTemperature> getAllBodyTemperatureByUserId(long id) {
    return bodyTemperatureRepository.findAllByUserId(id);
  }

  public List<BodyTemperature> getAllBodyTemperature() {
    return bodyTemperatureRepository.findAll();
  }

  public void createBodyTemperature(CreateBodyTemperature createBodyTemperatureDTO, long userId,
      Long childId) {
    BodyTemperature bodyTemperature = new BodyTemperature(
        userId,
        createBodyTemperatureDTO.getDate(),
        createBodyTemperatureDTO.getBodyTemperatureCelsius(),
        childId);

    bodyTemperatureRepository.save(bodyTemperature);
  }

  public List<BodyTemperature> getAllBodyTemperatureByUserIdAndChildId(Long userId, Long childId) {
    if(childId != null) {
      return bodyTemperatureRepository.findByChildId(childId);
    } else {
      return bodyTemperatureRepository.findByUserIdAndChildId(userId, null);
    }
  }
}