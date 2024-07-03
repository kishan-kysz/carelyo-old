package com.carelyo.v1.repos.user;

import com.carelyo.v1.model.user.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * User repository
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByEmail(String email);

  Optional<User> findByEmailOrMobile(String Email, String mobile);

  Optional<User> findByMobile(String mobile);

  Optional<User> findByReferralCode(String referralCode);
}
