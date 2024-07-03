package com.carelyo.v1.service.security.services;

import com.carelyo.v1.model.user.User;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import net.minidev.json.annotate.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * User details with authorities
 */

// Annotation below is for Swagger usage

public class UserDetailsImpl implements UserDetails {

  private static final long serialVersionUID = 1L;

  private final Long id;

  @JsonIgnore
  private final String email;
  @JsonIgnore
  private final String mobile;

  @JsonIgnore
  private final String password;
  @JsonIgnore
  private final Collection<? extends GrantedAuthority> authorities;
  @JsonIgnore
  private final String referralCode;
  @JsonIgnore
  private final Long referralCount;
  @JsonIgnore
  Boolean profileComplete;
  @JsonIgnore
  Boolean enabled;


  public UserDetailsImpl(Long id, String email, String mobile, String password,
      Boolean profileComplete, List<GrantedAuthority> authorities, String referralCode,
      Long referralCount) {
    this.id = id;
    this.email = email;
    this.mobile = mobile;
    this.password = password;
    this.profileComplete = profileComplete;
    this.authorities = authorities;
    this.referralCode = referralCode;
    this.referralCount = referralCount;
    this.enabled = !authorities.stream().map(GrantedAuthority::getAuthority)
        .collect(Collectors.toList()).contains("DISABLED");
  }

  /**
   * builds new UserDetailsImpl with authorities for that role
   *
   * @param user the User
   * @return new UserDetailsImpl
   */
  public static UserDetailsImpl build(User user) {
    List<GrantedAuthority> authorities = Collections.singletonList(
        new SimpleGrantedAuthority(user.getRole().getName().name()));

    return new UserDetailsImpl(
        user.getId(),
        user.getEmail(),
        user.getMobile(),
        user.getPassword(),
        user.getProfileComplete(),
        authorities,
        user.getReferralCode(),
        user.getReferralCount()

    );
  }

  @Override
  @JsonIgnore
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return authorities;
  }

  public Long getId() {
    return id;
  }

  public String getEmail() {
    return email;
  }

  public String getMobile() {
    return mobile;
  }

  public String getReferralCode() {
    return referralCode;
  }

  public Long getReferralCount() {
    return referralCount;
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return email;
  }

  @Override
  @JsonIgnore
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  @JsonIgnore
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  @JsonIgnore
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  @JsonIgnore
  public boolean isEnabled() {
    return true;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    UserDetailsImpl user = (UserDetailsImpl) o;
    return Objects.equals(id, user.id);
  }


}
