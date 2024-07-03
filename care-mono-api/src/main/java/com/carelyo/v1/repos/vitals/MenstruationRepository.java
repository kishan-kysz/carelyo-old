package com.carelyo.v1.repos.vitals;

import com.carelyo.v1.model.vitals.Menstruation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenstruationRepository extends JpaRepository<Menstruation, Long> {

  List<Menstruation> findAllByUserId(Long userId);

  List<Menstruation> findByUserIdAndChildId(Long userId, Long childId);

  List<Menstruation> findByChildId(Long childId);
}
