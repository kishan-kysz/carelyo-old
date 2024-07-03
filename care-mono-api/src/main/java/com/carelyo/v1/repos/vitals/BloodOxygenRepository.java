package com.carelyo.v1.repos.vitals;

import com.carelyo.v1.model.vitals.BloodOxygen;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BloodOxygenRepository extends JpaRepository<BloodOxygen, Long> {

  List<BloodOxygen> findAllByUserId(Long userId);

  List<BloodOxygen> findByUserIdAndChildId(Long userId, Long childId);

  List<BloodOxygen> findByChildId(Long childId);
}
