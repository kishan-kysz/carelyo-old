package com.carelyo.v1.repos.provider;

import com.carelyo.v1.model.provider.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {

  @Query("SELECT p FROM Provider p WHERE p.isDefault = true")
  Provider findDefaultProvider();
}
