package com.carelyo.v1.repos.user;

import com.carelyo.v1.model.user.SystemAdmin;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemAdminRepository extends JpaRepository<SystemAdmin, Long> {
  Optional<SystemAdmin> findByUserId(Long userId);
  SystemAdmin getByUserId(Long userId);
}
