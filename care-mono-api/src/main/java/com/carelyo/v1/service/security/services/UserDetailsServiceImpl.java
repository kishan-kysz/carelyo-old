package com.carelyo.v1.service.security.services;

import com.carelyo.v1.model.user.User;
import com.carelyo.v1.service.user.UserService;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for userDetailsImpl
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

  UserService userService;

  /*
  UserDetailsServiceImpl, UserService and LoadDataService are all relying on each other on start-up,
  putting @lazy on UserDetailsServiceImpl fixed this.
   */
  @Lazy
  public UserDetailsServiceImpl (UserService userService) {
    this.userService = userService;
  }

  /**
   * builds a new UserDetailsImpl from the email/mobil
   *
   * @param email email
   * @return new UserDetailsImpl
   */
  @Override
  @Transactional
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

    if (userService.existsByEmail(email)) {
      User user = userService.findByEmail(email);
      return UserDetailsImpl.build(user);
    } else {
      throw new UsernameNotFoundException("User Not Found with email: " + email);
    }
  }
}
