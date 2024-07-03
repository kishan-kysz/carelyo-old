// package com.carelyo.v1.config;

// import java.util.Arrays;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.context.annotation.Profile;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.reactive.CorsWebFilter;

// @Configuration
// @Profile("prod")
// public class ProdCorsConfig {
//   @Bean
//   public CorsWebFilter corsWebFilter() {
//     CorsConfiguration config = new CorsConfiguration();
//     config.setAllowCredentials(true);
    
//     //CORS Duration to 1hour
//     config.setMaxAge(3600L);
    
//     config.setAllowedOrigins(
//         Arrays.asList("https://carelyo.io", "https://carelyo.top", "https://carelyo.com", "https://carelyo.com"));
//     config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
//     config.setAllowedHeaders(Arrays.asList("*"));

//     org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource();
//     source.registerCorsConfiguration("/api/**", config);

//     return new CorsWebFilter(source);
//   }
// }