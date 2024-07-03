package com.carelyo.v1.service.provider;

import com.carelyo.v1.dto.provider.ProviderFormDTO;
import com.carelyo.v1.dto.provider.ProviderInformationDTO;
import com.carelyo.v1.model.provider.Provider;
import com.carelyo.v1.repos.provider.ProviderRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProviderService {

  private final ProviderRepository providerRepository;

  public ProviderService(ProviderRepository providerRepository) {
    this.providerRepository = providerRepository;
  }

  public List<Provider> getAllProvider() {
    return providerRepository.findAll();
  }

  public List<ProviderInformationDTO> getProviderHeaders() {
    List<Provider> providers = providerRepository.findAll();
    List<ProviderInformationDTO> providerHeaders = new ArrayList<>();
    for (Provider provider : providers) {
      providerHeaders.add(
          new ProviderInformationDTO(
              provider.getId(),
              provider.getAddress(),
              provider.getProviderName(),
              provider.getWebPageUrl(),
              provider.getLogoURL(),
              provider.getCountry(),
              provider.getCurrency(),
              provider.getProviderType())
      );
    }
    return providerHeaders;
  }

  public Provider save(Provider provider) {
    return providerRepository.save(provider);
  }

  public Provider postProvider(ProviderFormDTO providerFormDTO) {
    Provider provider = new Provider();
    provider.setProviderName(providerFormDTO.getProviderName());
    provider.setAddress(providerFormDTO.getAddress());
    provider.setEmail(providerFormDTO.getEmail());
    provider.setPhoneNumber(providerFormDTO.getPhoneNumber());
    provider.setWebPageUrl(providerFormDTO.getWebPageUrl());
    provider.setPracticeNumber(providerFormDTO.getPracticeNumber());
    provider.setSecondaryEmail(providerFormDTO.getSecondaryEmail());
    provider.setCountry(providerFormDTO.getCountry());
    provider.setCurrency(providerFormDTO.getCurrency());
    provider.setLogoURL(providerFormDTO.getLogoURL());
    provider.setProviderType(provider.getProviderType());
    return providerRepository.save(provider);
  }

  public Provider getDefaultProvider() {
    Provider provider = providerRepository.findDefaultProvider();
    if (provider == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Default provider not found");
    }
    return provider;
  }

  public Provider getSpecificprovider(Long id) {
    Optional<Provider> provider = providerRepository.findById(id);
    if (provider.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Provider not found");
    }
    return provider.get();
  }

  public Provider update(Long id, ProviderFormDTO dto) {
    Provider provider = getSpecificprovider(id);

    provider.setProviderName(dto.getProviderName());
    provider.setPhoneNumber(dto.getPhoneNumber());
    provider.setAddress(dto.getAddress());
    provider.setPracticeNumber(dto.getPracticeNumber());
    provider.setEmail(dto.getEmail());
    provider.setSecondaryEmail(dto.getSecondaryEmail());
    provider.setWebPageUrl(dto.getWebPageUrl());
    provider.setCountry(dto.getCountry());
    provider.setCurrency(dto.getCurrency());
    provider.setLogoURL(dto.getLogoURL());
    provider.setProviderType(dto.getProviderType());
    return providerRepository.save(provider);
  }

  public void delete(Long id) {
    Provider provider = getSpecificprovider(id);
    providerRepository.delete(provider);
  }

  public Boolean checkIfProviderExists(Long providerId) {
    return providerRepository.findById(providerId).isPresent();
  }


  public Provider getProviderInformation(Long providerId) {
    if (providerRepository.findById(providerId).isPresent()) {
      return providerRepository.findById(providerId).get();
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Provider was not found");
  }
}
