package com.carelyo.v1.repos.user;

import com.carelyo.v1.model.role.ERole;
import com.carelyo.v1.model.role.Role;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Role repository
 */
@Repository
public interface RolesRepository extends JpaRepository<Role, Long> {

  Optional<Role> findByName(ERole name);

}
