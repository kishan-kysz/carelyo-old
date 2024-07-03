package com.carelyo.v1.repos.topup;

import com.carelyo.v1.dto.topup.UnverifiedTopUpDTO;
import com.carelyo.v1.model.topup.TopUp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface TopUpRepository extends JpaRepository<TopUp,Long> {
  Set<TopUp> findByIsValid(boolean isValid);


  Optional<TopUp> findByIdAndIsValid(Long id, boolean isValid);
  List<TopUp> findByUserIdAndIsValid(Long userId, boolean isValid);
  List<TopUp> findByEmailAndIsValid(String Email, boolean isValid);
}