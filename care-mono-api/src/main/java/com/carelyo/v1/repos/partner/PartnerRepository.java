package com.carelyo.v1.repos.partner;

import com.carelyo.v1.model.user.Partner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PartnerRepository extends JpaRepository<Partner, Long> {

  Optional<Partner> findByEmail(String email);
  Optional<Partner> findByMobile(String mobile);
  Optional<Partner> findByEmailOrMobile(String Email, String mobile);

}
