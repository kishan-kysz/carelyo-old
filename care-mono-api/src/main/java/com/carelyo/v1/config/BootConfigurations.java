package com.carelyo.v1.config;

import com.carelyo.v1.model.provider.Provider;
import java.util.Arrays;
import java.util.List;
import com.carelyo.v1.service.provider.ProviderService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.server.ResponseStatusException;


public class BootConfigurations {

  @Configuration
  public static class ConfigureProvider {

    @Value("${provider.name}")
    private String name;
    @Value("${provider.address}")
    private String address;
    @Value("${provider.mobile}")
    private String mobile;
    @Value("${provider.email}")
    private String email;
    @Value("${provider.website}")
    private String website;
    @Value("${provider.logo}")
    private String logo;
    @Value("${provider.country}")
    private String country;
    @Value("${provider.currency}")
    private String currency;
    @Value("${provider.practice_number}")
    private String practiceNumber;
    @Value("${provider.type}")
    private String type;

    public void configure(ProviderService providerService) {

      System.out.println(
          ConsoleColors.GREEN_BACKGROUND + ConsoleColors.BLACK_BOLD + "Starting provider configuration..."
              + ConsoleColors.RESET);

      /*
      Put this inside a try catch because providerService.getDefaultProvider() throws exception
      instead of returning null (calling repository directly did return null).
      This is only to prevent too much change in the code... when changing so this service calls the
      providerService instead of the providerRepository directly.
      */
      try {
        providerService.getDefaultProvider();
      } catch (ResponseStatusException e) {
        System.out.println(ConsoleColors.CYAN_BACKGROUND_BRIGHT + ConsoleColors.BLACK_BOLD
            + "Provider not found for this instance, creating new one with..." + ConsoleColors.RESET);
        List<String> values = Arrays.asList(name, address, mobile, email, website, logo, country,
            currency);
        if (values.contains(null)) {
          System.out.println(ConsoleColors.WHITE_BACKGROUND_BRIGHT + ConsoleColors.RED
              + "Aborting provider creation, values cannot be null" + ConsoleColors.RESET);
          throw new RuntimeException("Provider values cannot be null");
        }
        values.forEach(value -> System.out.println(ConsoleColors.BLUE_UNDERLINED + value + ConsoleColors.RESET));
        System.out.println(ConsoleColors.CYAN_BACKGROUND_BRIGHT + ConsoleColors.BLACK_BOLD + "Creating provider..."
            + ConsoleColors.RESET);
        Provider provider = new Provider();
        provider.setProviderName(name);
        provider.setAddress(address);
        provider.setPhoneNumber(mobile);
        provider.setEmail(email);
        provider.setLogoURL(logo);
        provider.setWebPageUrl(website);
        provider.setCountry(country);
        provider.setCurrency(currency);
        provider.setPracticeNumber(practiceNumber);
        provider.setProviderType(type);
        provider.setIsDefault(true);
        providerService.save(provider);
        System.out.println(
            ConsoleColors.GREEN_BACKGROUND_BRIGHT + ConsoleColors.BLACK_BOLD
                + "Default provider created successfully..."
                + ConsoleColors.RESET);
      }
        System.out.println(
            ConsoleColors.BLACK_BACKGROUND + ConsoleColors.YELLOW_BOLD
                + "Default provider found for this instance, skipping..."
                + ConsoleColors.RESET);

      System.out.println(
          ConsoleColors.GREEN_BACKGROUND + ConsoleColors.BLACK_BOLD + "Provider configuration completed..."
              + ConsoleColors.RESET);
    }
  }
}



