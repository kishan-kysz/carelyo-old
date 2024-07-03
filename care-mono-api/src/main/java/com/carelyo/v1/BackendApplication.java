package com.carelyo.v1;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(servers = {
    @Server(url = "/", description = "Default Server URL")
})
public class BackendApplication {

  public static void main(String[] args) {
    SpringApplication app = new SpringApplication(BackendApplication.class);
    String profile = determineProfile();
    app.setAdditionalProfiles(profile);
    app.run(args);
  }

  private static String determineProfile() {
    // Logic to determine the active profile based on the environment variable
    String envProfile = System.getenv("SPRING_PROFILES_ACTIVE");
    // Default to prod if not specified
    return (envProfile != null && !envProfile.isEmpty()) ? envProfile : "prod";
  }
}

// package com.carelyo.v1;

// import io.swagger.v3.oas.annotations.OpenAPIDefinition;
// import io.swagger.v3.oas.annotations.servers.Server;
// import org.springframework.boot.SpringApplication;
// import org.springframework.boot.autoconfigure.SpringBootApplication;

// @OpenAPIDefinition(servers = {
// @Server(url = "/", description = "Default Server URL")
// })
// @SpringBootApplication
// public class BackendApplication {

// public static void main(String[] args) {
// SpringApplication.run(BackendApplication.class, args);
// }

// }
