package com.carelyo.v1.service.user;

import com.carelyo.v1.model.user.SystemAdmin;
import com.carelyo.v1.repos.user.SystemAdminRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class SystemAdminService {

  private final SystemAdminRepository systemAdminRepository;

  public SystemAdminService(SystemAdminRepository systemAdminRepository) {
    this.systemAdminRepository = systemAdminRepository;
  }

  public Optional<SystemAdmin> getByUserIdOptional(Long userId) {
    return systemAdminRepository.findByUserId(userId);
  }

  public SystemAdmin getByUserId(Long userId) {
    return systemAdminRepository.getByUserId(userId);
  }

  public SystemAdmin getOne(Long id) {
    return systemAdminRepository.getOne(id);
  }

  public void save(SystemAdmin systemAdmin) {
    systemAdminRepository.save(systemAdmin);
  }
}
