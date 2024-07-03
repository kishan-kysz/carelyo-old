package com.carelyo.v1.service;

import com.carelyo.v1.config.BootConfigurations.ConfigureProvider;
import com.carelyo.v1.dto.auth.SignupDTO;
import com.carelyo.v1.dto.pricelist.StdPriceListDTO;
import com.carelyo.v1.model.message.Message;
import com.carelyo.v1.model.role.ERole;
import com.carelyo.v1.model.role.Role;
import com.carelyo.v1.service.auth.RegistrationService;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import com.carelyo.v1.service.pricelist.PriceListService;
import com.carelyo.v1.service.provider.ProviderService;
import com.carelyo.v1.service.user.MessageService;
import com.carelyo.v1.service.user.RolesService;
import com.carelyo.v1.service.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

/**
 * loads data when backend starts
 */
@Component
public class LoadDataService implements CommandLineRunner {

  private static final Logger logger = LoggerFactory.getLogger(LoadDataService.class);

  private final RolesService rolesService;
  private final UserService userService;
  private final RegistrationService registrationService;
  private final PriceListService priceListService;
  private final ProviderService providerService;
  private final ConfigureProvider configureProvider;
  private final MessageService messageService;

  public LoadDataService(RolesService rolesService, UserService userService,
      RegistrationService registrationService,
      PriceListService priceListService,
      ProviderService providerService,
      ConfigureProvider configureProvider,
      MessageService messageService) {
    this.rolesService = rolesService;
    this.userService = userService;
    this.registrationService = registrationService;
    this.priceListService = priceListService;
    this.providerService = providerService;
    this.configureProvider = configureProvider;
    this.messageService = messageService;
  }

  private static String getTemplate(String templateName) throws IOException {
    InputStream resource = new ClassPathResource(
        "/templates/" + templateName + ".html").getInputStream();
    try {
      return new String(resource.readAllBytes());
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  /**
   * run method where all data is loaded and saved
   *
   * @param args (String... args) means you can add multiple String params
   */
  @Override
  public void run(String... args) throws IOException {

    if (rolesService.getAll().isEmpty()) {
      ERole[] roles = ERole.values();
      Arrays.stream(roles).map(Role::new).forEach(rolesService::save);
      rolesService.getAll().forEach(role -> logger.info("{}", role.getName()));
    }

    try {
      String ADMIN_EMAIL = System.getenv("ADMIN_EMAIL");
      String ADMIN_PASSWORD = System.getenv("ADMIN_PASSWORD");
      String ADMIN_MOBILE = System.getenv("ADMIN_MOBILE");

      if (!userService.existsByEmail(ADMIN_EMAIL)) {
        SignupDTO.AdminSignupDTO admDTO = new SignupDTO.AdminSignupDTO(ADMIN_EMAIL,
            ADMIN_PASSWORD,
            ADMIN_MOBILE, "Carelyo", "Devs",false);

        registrationService.registerAdmin(admDTO);

        logger.info("Default admin account created.");
      }

    } catch (Exception e) {
      logger.error("Error while creating default admin account: {}", e.getMessage());
    }

    if (!messageService.isWelcomeMessageTrue()) {
      Message welcomeMessage = new Message("Welcome", "Carelyo", "Welcome to Carelyo!");
      welcomeMessage.setWelcomeMessage(true);

      messageService.save(welcomeMessage);

      logger.info("Default welcome message created");
    }

    // Some price lists: consultation, followup, child.
    StdPriceListDTO consultationPriceDTO = new StdPriceListDTO("consultation", 500.0, 0.0, .3,
        50.0);
    if(!priceListService.priceListExistsById(consultationPriceDTO.getName())) {
      priceListService.createPriceList(consultationPriceDTO);
    }

    StdPriceListDTO followupPriceDTO = new StdPriceListDTO("followup", 350.0, 0.0, .3, 35.0);
    if(!priceListService.priceListExistsById(followupPriceDTO.getName())) {
      priceListService.createPriceList(followupPriceDTO);
    }

    StdPriceListDTO childPriceDTO = new StdPriceListDTO("child", 400.0, 0.0, .3, 40.0);
    if(!priceListService.priceListExistsById(childPriceDTO.getName())) {
      priceListService.createPriceList(childPriceDTO);
    }

    configureProvider.configure(providerService);
  }
}
