package com.carelyo.v1.service.stripecurrency;

import com.carelyo.v1.dto.stripecurrency.PaymentProviderDto;
import com.carelyo.v1.model.stripecurrency.StripeCurrency;
import com.carelyo.v1.repos.stripecurrency.StripeCurrencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class StripeCurrencyService {
  StripeCurrencyRepository stripeCurrencyRepository;

  @Autowired
  public StripeCurrencyService(StripeCurrencyRepository stripeCurrencyRepository)
  {
    this.stripeCurrencyRepository = stripeCurrencyRepository;
  }

  public StripeCurrency getStripeCurrencyByCode(String code)
  {
    Optional<StripeCurrency> stripeCurrency = stripeCurrencyRepository.findByCode(code);

    if(stripeCurrency.isEmpty())
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Currency not found");

    return stripeCurrency.get();
  }

  public boolean existsByCode(String code)
  {
    Optional<StripeCurrency> stripeCurrency = stripeCurrencyRepository.findByCode(code);

    return stripeCurrency.isPresent();
  }

  public PaymentProviderDto getPaymentProviderDto(String paymentService)
  {
    return new PaymentProviderDto(paymentService);
  }
}
