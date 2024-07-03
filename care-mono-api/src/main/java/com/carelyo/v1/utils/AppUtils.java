package com.carelyo.v1.utils;

import com.carelyo.v1.service.security.services.UserDetailsImpl;
import java.awt.Color;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import org.apache.commons.lang3.RandomStringUtils;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.core.GrantedAuthority;

public class AppUtils {

  /**
   * Generates a random nine character password with both upper case letters, lower case letters and numbers
   *
   * @return a string
   */

  public static String generateCommonLangPassword() {
    String upperCaseLetters = RandomStringUtils.random(3, 65, 90, true, true);
    String lowerCaseLetters = RandomStringUtils.random(3, 97, 122, true, true);
    String numbers = RandomStringUtils.randomNumeric(3);
    String totalChars = RandomStringUtils.randomAlphanumeric(3);
    String combinedChars = upperCaseLetters.concat(lowerCaseLetters)
        .concat(numbers)
        .concat(totalChars);
    List<Character> pwdChars = combinedChars.chars()
        .mapToObj(c -> (char) c)
        .collect(Collectors.toList());
    Collections.shuffle(pwdChars);
    return pwdChars.stream()
        .collect(StringBuilder::new, StringBuilder::append, StringBuilder::append)
        .toString();
  }

  public static Long enforceTargetIdIfAdminOrDoctor(Long targetId, UserDetailsImpl userDetails) {
    if (userDetails.getAuthorities().stream().anyMatch(r -> r.getAuthority().equals("DOCTOR"))
        ||
        userDetails.getAuthorities().stream()
            .anyMatch(r -> r.getAuthority().equals("SYSTEMADMIN"))) {
      return targetId;
    } else if (userDetails.getAuthorities().stream()
        .anyMatch(r -> r.getAuthority().equals("PATIENT"))) {
      return userDetails.getId();
    }

    return null;
  }

  public static Long enforceTargetIfAdmin(Long targetId, UserDetailsImpl userDetails) {
    if (userDetails.getAuthorities().stream()
        .anyMatch(r -> r.getAuthority().equals("SYSTEMADMIN"))) {
      return targetId;
    }
    return userDetails.getId();
  }

  public static boolean hasRole(UserDetailsImpl userDetails, String role) {
    return userDetails.getAuthorities().stream().anyMatch(r -> r.getAuthority().equals(role));
  }

  public static List<String> getRoles(UserDetailsImpl userDetails) {
    return userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
  }

  public static String getRandomHexColor() {
    Random rand = new Random();
    Color randomColor = new Color(rand.nextInt(256), rand.nextInt(256), rand.nextInt(256));
    return String.format("#%02x%02x%02x", randomColor.getRed(), randomColor.getGreen(), randomColor.getBlue());
  }

  @NotNull
  public static String getCurrentDateTime() {
    return LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"));
  }

}
