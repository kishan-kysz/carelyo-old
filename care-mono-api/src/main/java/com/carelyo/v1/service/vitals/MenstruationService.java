package com.carelyo.v1.service.vitals;

import com.carelyo.v1.dto.vitals.VitalsDTO.CreateMenstruation;
import com.carelyo.v1.model.vitals.Menstruation;
import com.carelyo.v1.repos.vitals.MenstruationRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MenstruationService {

  private final MenstruationRepository menstruationRepository;

  public MenstruationService(MenstruationRepository menstruationRepository) {
    this.menstruationRepository = menstruationRepository;
  }

  public List<Menstruation> getAllMenstruationByUserId(Long userId) {
    return menstruationRepository.findAllByUserId(userId);
  }

  public List<Menstruation> getAllMenstruation() {
    return menstruationRepository.findAll();
  }

  public void createMenstruation(CreateMenstruation createMenstruationDTO, Long userId,
      Long childId) {
    Menstruation menstruation = new Menstruation(
        userId,
        createMenstruationDTO.getFlow(),
        createMenstruationDTO.getStartOfCycle(),
        createMenstruationDTO.getDate(),
        createMenstruationDTO.getEndOfCycleDate(),
        createMenstruationDTO.getStartOfCycleDate(),
        createMenstruationDTO.getContraceptive(),
        childId);

    menstruationRepository.save(menstruation);
  }

  public List<Menstruation> getAllMenstruationByUserIdAndChildId(Long userId, Long childId) {
    if(childId != null) {
      return menstruationRepository.findByChildId(childId);
    } else {
      return menstruationRepository.findByUserIdAndChildId(userId, null);
    }
  }
}
