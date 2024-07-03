package com.carelyo.v1.repos.vitals;

import com.carelyo.v1.model.vitals.BloodGlucose;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BloodGlucoseRepository extends JpaRepository<BloodGlucose, Long> {

  List<BloodGlucose> findAllByUserId(Long userId);

  List<BloodGlucose> findByUserIdAndChildId(Long userId, Long childId);

  List<BloodGlucose> findByChildId(Long childId);
}
