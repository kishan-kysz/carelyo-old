package com.carelyo.v1.service.partner;

import com.carelyo.v1.model.user.Partner;
import com.carelyo.v1.repos.partner.PartnerRepository;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class PartnerService {

  private final PartnerRepository partnerRepository;

  public PartnerService(PartnerRepository partnerRepository) {
    this.partnerRepository = partnerRepository;
  }

  public Partner savePartner(Partner partner) {
    return partnerRepository.save(partner);
  }

  public boolean existsByEmailOrMobile(String email, String mobile) {
    return partnerRepository.findByEmail(email).isPresent() ||
        partnerRepository.findByMobile(mobile).isPresent();
  }

  public Optional<Partner> findByEmailOrMobile(String email, String mobile) {
    return partnerRepository.findByEmailOrMobile(email, mobile);
  }

  public Optional<Partner> findById(Long id) {
    return partnerRepository.findById(id);
  }

  public void deleteById(Long id) {
    partnerRepository.deleteById(id);
  }

}
