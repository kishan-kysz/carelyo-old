package com.carelyo.v1.service.user;

import org.springframework.stereotype.Service;

@Service
public class ReferralCodeService {

  private final UserService userService;


  public ReferralCodeService(UserService userService) {
    this.userService = userService;
  }

  public String generateReferralCode(String input) {
    int CODE_LENGTH = 9;
    String AlphaNumericString = input.toUpperCase() + "0123456789"
        + input.toLowerCase();
    StringBuilder generatedCode = new StringBuilder(CODE_LENGTH);
    for (int i = 0; i < CODE_LENGTH; i++) {

// generate a random number between
// 0 to AlphaNumericString variable length
      int index = (int) (AlphaNumericString.length() *
          Math.random());
// add Character one by one in end of sb
      generatedCode.append(AlphaNumericString.charAt(index));
    }
    if (userService.getUserByReferralCode(generatedCode.toString()).isPresent()) {
      generateReferralCode(input);
    }
    return generatedCode.toString();
  }


}
