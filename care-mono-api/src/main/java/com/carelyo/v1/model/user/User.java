package com.carelyo.v1.model.user;

import com.carelyo.v1.dto.user.UserDTO;
import com.carelyo.v1.model.BaseModel;
import com.carelyo.v1.model.role.Role;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * User data
 */
@Getter
@Setter
@Entity
@NoArgsConstructor
public class User extends BaseModel {

  @NotBlank
  @Size(max = 50)
  @Email
  private String email;
  @Size(max = 120)
  private String password;
  @Column(unique = true)
  @NotBlank
  @Size(min = 3, max = 20)
  private String mobile;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinTable(name = "user_roles",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "role_name", referencedColumnName = "name"))
  private Role role;
  private Boolean profileComplete;
  private String referralCode;
  private Long referralCount;
  private Boolean consent;
  private Boolean sso;
  private String profilePhoto;

  public User(String email, String password, String mobile, String referralCode,
      Boolean consent, Boolean sso, String profilePhoto) {
    this.email = email;
    this.password = password;
    this.mobile = mobile;
    this.referralCount = 0L;
    this.profileComplete = false;
    this.referralCode = referralCode;
    this.consent = consent;
    this.sso = sso;
    this.profilePhoto = profilePhoto;

  }

  public User(Long userId, String email) {
    super();
  }

  public UserDTO getUserDTO() {
    return new UserDTO(
        this.getId(),
        this.email,
        this.mobile,
        this.role.getName());
  }

  public void increaseReferralCount() {
    ++referralCount;
  }

}
