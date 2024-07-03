// package com.carelyo.v1.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.context.annotation.Profile;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.reactive.CorsWebFilter;
// import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

// @Configuration
// @Profile("dev")
// public class DevCorsConfig {

//     @Bean
//     public CorsWebFilter corsWebFilter() {
//         CorsConfiguration config = new CorsConfiguration();
//         config.setAllowCredentials(true);
//         config.addAllowedOrigin("http://localhost:3122");
//         config.addAllowedHeader("*");
//         config.addAllowedMethod("*");
//         UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//         source.registerCorsConfiguration("/**", config); // Global CORS configuration for all endpoints

//         return new CorsWebFilter(source);
//     }
// }
