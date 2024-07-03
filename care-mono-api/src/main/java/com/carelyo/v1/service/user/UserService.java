package com.carelyo.v1.service.user;

import com.carelyo.v1.dto.user.UpdateEmailDTO;
import com.carelyo.v1.dto.user.UpdatePasswordDTO;
import com.carelyo.v1.dto.user.UpdatePhoneNumberDTO;
import com.carelyo.v1.model.role.ERole;
import com.carelyo.v1.model.role.Role;
import com.carelyo.v1.model.user.User;
import com.carelyo.v1.repos.user.UserRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

  UserRepository userRepository;
  PasswordEncoder passwordEncoder;
  RolesService rolesService;

  public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
      RolesService rolesService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.rolesService = rolesService;
  }

  public void save(User user) {
    userRepository.save(user);
  }


  /**
   * Update a users password
   *
   * @param updatePasswordDTO UpdatePasswordDTO
   * @param userId            userId
   */
  public void updatePassword(UpdatePasswordDTO updatePasswordDTO, Long userId) {
    if (userRepository.findById(userId).isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND,
          "User with the provided id could not be found or does not exist");
    }

    User user = userRepository.findById(userId).get();

    if (!passwordEncoder.matches(updatePasswordDTO.getCurrentPassword(), user.getPassword())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Incorrect password");
    }

    user.setPassword(passwordEncoder.encode(updatePasswordDTO.getNewPassword()));
    userRepository.save(user);
  }

  /**
   * Update a users email
   *
   * @param updateEmailDTO UpdateEmailDTO
   * @param userId         userId
   */
  public void updateEmail(UpdateEmailDTO updateEmailDTO, Long userId) {
    if (userRepository.findByEmail(updateEmailDTO.getNewEmail()).isPresent()) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
    }

    if (userRepository.findById(userId).isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND,
          "User with the provided id could not be found or does not exist");
    }

    User user = userRepository.findById(userId).get();

    if (!passwordEncoder.matches(updateEmailDTO.getPassword(), user.getPassword())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Incorrect password");
    }

    user.setEmail(updateEmailDTO.getNewEmail());
    userRepository.save(user);
  }

  /**
   * Update a users phone number
   *
   * @param updatePhoneNumberDTO UpdatePhoneNumberDTO
   * @param userId               userId
   */
  public void updatePhoneNumber(UpdatePhoneNumberDTO updatePhoneNumberDTO, Long userId) {
    if (userRepository.findByMobile(updatePhoneNumberDTO.getNewPhoneNumber()).isPresent()) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Phone number already in use");
    }

    if (userRepository.findById(userId).isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND,
          "User with the provided id could not be found or does not exist");
    }

    User user = userRepository.findById(userId).get();

    if (!passwordEncoder.matches(updatePhoneNumberDTO.getPassword(), user.getPassword())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Incorrect password");
    }

    user.setMobile(updatePhoneNumberDTO.getNewPhoneNumber());
    userRepository.save(user);
  }

  public User getUserById(Long userId) {
    if (userRepository.findById(userId).isPresent()) {
      return userRepository.findById(userId).get();
    }
    // .orElseThrow(ResourceNotFoundException::new)
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
  }

  public Optional<User> findById(Long id) {
    return userRepository.findById(id);
  }

  public Optional<User> findByEmailOrMobile(String email, String mobile) {
    return userRepository.findByEmailOrMobile(email, mobile);
  }

  public boolean existsByEmailOrMobile(String email, String mobile) {
    return userRepository.findByEmail(email).isPresent() ||
        userRepository.findByMobile(mobile).isPresent();
  }

  /**
   * Gets a role by name
   *
   * @param name role
   * @return Role
   */
  public Role getRoleByName(ERole name) {
    Optional<Role> optionalRole = rolesService.getByName(name);
    if (optionalRole.isPresent()) {
      return optionalRole.get();
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND,
        "Role with the provided name could not be found");
  }

  public User addRoleToUser(User user, ERole roleName) {
    Role role = getRoleByName(roleName);
    user.setRole(role);
    return userRepository.save(user);
  }

  /**
   * Finds a user by referral code
   *
   * @param referralCode referralCode
   * @return User
   */
  public Optional<User> getUserByReferralCode(String referralCode) {
    return userRepository.findByReferralCode(referralCode);
  }

  /**
   * Finds a user by referral code and increments the number of referrals
   *
   * @param referralCode referralCode
   */
  public void incrementReferralCount(String referralCode) {
    Optional<User> optionalUser = getUserByReferralCode(referralCode);
    if (optionalUser.isPresent()) {
      User user = optionalUser.get();
      user.increaseReferralCount();
      userRepository.save(user);
    }

  }

  public User findByEmail(String email) {
    return userRepository.findByEmail(email).orElseThrow(
        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
  }

  public boolean existsByEmail(String email) {
    return userRepository.findByEmail(email).isPresent();
  }

  public boolean existsByMobile(String mobile) {
    return userRepository.findByMobile(mobile).isPresent();
  }

  public List<User> getAll() {
    return userRepository.findAll();
  }
}