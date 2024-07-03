package com.carelyo.v1.repos.vitals;

import com.carelyo.v1.model.vitals.BodyTemperature;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BodyTemperatureRepository extends JpaRepository<BodyTemperature, Long> {

  List<BodyTemperature> findAllByUserId(long id);

  List<BodyTemperature> findByUserIdAndChildId(Long userId, Long childId);

  List<BodyTemperature> findByChildId(Long childId);
}
