package com.carelyo.v1.service.user;

import com.carelyo.v1.model.role.ERole;
import com.carelyo.v1.model.role.Role;
import com.carelyo.v1.repos.user.RolesRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RolesService {

  private final RolesRepository rolesRepository;

  public RolesService(RolesRepository rolesRepository) {
    this.rolesRepository = rolesRepository;
  }

  public Optional<Role> getByName(ERole name) {
    return rolesRepository.findByName(name);
  }

  public List<Role> getAll() {
    return rolesRepository.findAll();
  }

  public void save(Role role) {
    rolesRepository.save(role);
  }

}
