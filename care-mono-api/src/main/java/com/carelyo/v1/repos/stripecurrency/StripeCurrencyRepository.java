package com.carelyo.v1.repos.stripecurrency;

import com.carelyo.v1.model.stripecurrency.StripeCurrency;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StripeCurrencyRepository extends JpaRepository<StripeCurrency, Long> {

  Optional<StripeCurrency> findByCode(String code);
}
