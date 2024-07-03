package com.carelyo.v1.service.security;

import com.carelyo.v1.service.security.jwt.AuthEntryPointJwt;
import com.carelyo.v1.service.security.jwt.AuthTokenFilter;
import com.carelyo.v1.service.security.jwt.JwtUtils;
import com.carelyo.v1.service.security.services.UserDetailsServiceImpl;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springdoc.core.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.core.env.Environment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Arrays;
import java.time.Duration;


@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

  private static final Logger logger = LoggerFactory.getLogger(WebSecurityConfig.class);

  private static final String[] SWAGGER_WHITELIST = {
      "/v3/api-docs/**",
      "/swagger-ui/**",
      "/swagger-ui.html",
      "/api/**"
  };
  private final UserDetailsServiceImpl userDetailsService;
  private final AuthEntryPointJwt unauthorizedHandler;
  private final JwtUtils jwtUtils;


  public WebSecurityConfig(
      UserDetailsServiceImpl userDetailsService,
      AuthEntryPointJwt unauthorizedHandler,
      JwtUtils jwtUtils,
      ProfileProperties profileProperties) {
    this.userDetailsService = userDetailsService;
    this.unauthorizedHandler = unauthorizedHandler;
    this.jwtUtils = jwtUtils;
    this.profileProperties = profileProperties;
  }

  @Bean
  public OpenAPI customizeOpenAPI() {
    final String securitySchemeName = "bearerAuth";
    return new OpenAPI()
        .addSecurityItem(new SecurityRequirement()
            .addList(securitySchemeName))
        .components(new Components()
            .addSecuritySchemes(securitySchemeName,
                new io.swagger.v3.oas.models.security.SecurityScheme()
                    .name(securitySchemeName)
                    .type(io.swagger.v3.oas.models.security.SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")));
  }

  @Bean
  public GroupedOpenApi PublicV1() {
    String[] paths = { "/**/v1/**" };
    return GroupedOpenApi.builder().group("Api - V1").pathsToMatch(paths).build();
  }

  @Bean
  public GroupedOpenApi AdminApiV1() {
    String[] paths = { "/api/v1/admin/**" };
    return GroupedOpenApi.builder().group("Admin").pathsToMatch(paths).build();
  }

  @Bean
  public GroupedOpenApi ConsultationApi() {
    String[] paths = { "/**/consultations/**", "/**/consultation/**" };
    return GroupedOpenApi.builder().group("Consultations").pathsToMatch(paths).build();
  }

  @Bean
  public GroupedOpenApi DoctorApi() {
    String[] paths = { "/**/doctors/**", "/**/doctor/**" };
    return GroupedOpenApi.builder().group("Doctors").pathsToMatch(paths).build();
  }

  @Bean
  public GroupedOpenApi PatientApi() {
    String[] paths = { "/**/patients/**", "/**/patient/**" };
    return GroupedOpenApi.builder().group("Patients").pathsToMatch(paths).build();
  }

  @Bean
  public GroupedOpenApi AllApi() {
    String[] paths = { "/**/api/**" };
    return GroupedOpenApi.builder().group("ALL").pathsToMatch(paths).build();
  }

  @Bean
  public GroupedOpenApi AuthApi() {
    String[] paths = { "/**/auth/**" };
    return GroupedOpenApi.builder().group("Auth").pathsToMatch(paths).build();
  }

  @Bean
  public AuthTokenFilter authenticationJwtTokenFilter() {
    return new AuthTokenFilter(userDetailsService, jwtUtils);
  }

  @Override
  public void configure(AuthenticationManagerBuilder authenticationManagerBuilder)
      throws Exception {
    authenticationManagerBuilder.userDetailsService(userDetailsService)
        .passwordEncoder(passwordEncoder());
  }

  @Bean
  @Override
  public AuthenticationManager authenticationManagerBean() throws Exception {
    return super.authenticationManagerBean();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Autowired
  private ProfileProperties profileProperties;

  @Autowired
  private Environment environment;

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    String activeProfile = environment.getProperty("SPRING_PROFILES_ACTIVE");

    // Step 1: Get allowed origins from profiles for subdomains
    List<String> allowedOrigins = new ArrayList<>(profileProperties.getAllowedOrigins(activeProfile));

    // Remove quotes from allowedOrigins
    allowedOrigins = allowedOrigins.stream().map(origin -> origin.replaceAll("[\"']", "")).collect(Collectors.toList());

    // Step 2: Add defaultAllowedOrigins to allowedOrigins if not already present
    List<String> defaultAllowedOrigins = Arrays.asList(
        "https://carelyo.io",
        "https://carelyo.com",
        "https://pillmart.carelyo.io",
        "https://api-pillmart.carelyo.io",
        "https://a-pillmart.carelyo.io",
        "https://d-pillmart.carelyo.io",
        "https://p-pillmart.carelyo.io",  
        "https://drkimto.carelyo.io",
        "https://api-drkimto.carelyo.io",
        "https://a-drkimto.carelyo.io",
        "https://d-drkimto.carelyo.io",
        "https://p-drkimto.carelyo.io",
        "https://drsamalonge.carelyo.io",
        "https://api-drsamalonge.carelyo.io",
        "https://a-drsamalonge.carelyo.io",        
        "https://d-drsamalonge.carelyo.io",
        "https://p-drsamalonge.carelyo.io",
        "https://ben.carelyo.io",
        "https://api-ben.carelyo.io",
        "https://a-ben.carelyo.io",        
        "https://d-ben.carelyo.io",
        "https://p-ben.carelyo.io",    
        "http://localhost",
        "http://localhost:3122",
        "http://localhost:3123",
        "http://localhost:5510",
        "http://192.168.29.214:5510",
        "http://localhost:5511",
        "http://localhost:5513",
        "http://192.168.29.214:5513",
        "http://localhost:5516",
        "http://localhost:3121",
        "http://localhost:3126",
        "http://localhost:5510",
        "http://localhost:5511",
        "http://localhost:5513",
        "http://localhost:5516");

    for (String defaultOrigin : defaultAllowedOrigins) {
      if (!allowedOrigins.contains(defaultOrigin)) {
        allowedOrigins.add(defaultOrigin);
      }
    }

    // Step 3: Add additionalAllowedOrigins to allowedOrigins
    String additionalAllowedOrigins = System.getenv("ADDITIONAL_ALLOWED_ORIGINS");
    if (additionalAllowedOrigins != null && !additionalAllowedOrigins.isEmpty()) {
      // Remove quotes from additionalAllowedOrigins
      additionalAllowedOrigins = additionalAllowedOrigins.replaceAll("[\"']", "").trim();
      allowedOrigins.addAll(Arrays.asList(additionalAllowedOrigins.split(",")));
    }

    CorsConfiguration corsConfig = new CorsConfiguration();
    corsConfig.setAllowCredentials(true);
    corsConfig.setAllowedOrigins(allowedOrigins);
    corsConfig.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
    corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE, OPTIONS"));
    corsConfig.setMaxAge(Duration.ofSeconds(600));

    // Log values for debugging
    logger.info("Allowed Origins: {}", allowedOrigins);

    http.cors().configurationSource(request -> corsConfig)
        .and()
        .csrf().disable()
        .exceptionHandling().authenticationEntryPoint(unauthorizedHandler)
        .and()
        .authorizeRequests().antMatchers(SWAGGER_WHITELIST).permitAll()
        .anyRequest().authenticated()
        .and()
        .addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
  }
}
