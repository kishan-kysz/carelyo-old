package com.carelyo.v1.repos.vitals;

import com.carelyo.v1.model.vitals.RespiratoryRate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RespiratoryRateRepository extends JpaRepository<RespiratoryRate, Long> {

  List<RespiratoryRate> findAllByUserId(Long userId);

  List<RespiratoryRate> findByUserIdAndChildId(Long userId, Long childId);

  List<RespiratoryRate> findByChildId(Long childId);
}
