package com.carelyo.v1.repos.vitals;

import com.carelyo.v1.model.vitals.BloodPressure;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BloodPressureRepository extends JpaRepository<BloodPressure, Long> {

  List<BloodPressure> findAllByUserId(long userId);

  List<BloodPressure> findByUserIdAndChildId(Long userId, Long childId);

  List<BloodPressure> findByChildId(Long childId);
}
