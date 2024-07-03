package com.carelyo.v1.repos.vitals;

import com.carelyo.v1.model.vitals.HeartRate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HeartRateRepository extends JpaRepository<HeartRate, Long> {

  List<HeartRate> findAllByUserId(Long userId);

  List<HeartRate> findByUserIdAndChildId(Long userId, Long childId);

  List<HeartRate> findByChildId(Long childId);
}
