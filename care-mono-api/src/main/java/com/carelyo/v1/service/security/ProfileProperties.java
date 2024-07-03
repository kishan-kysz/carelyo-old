// Class handles the CORS Profile for "dev" or "prod"
package com.carelyo.v1.service.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "profiles")
public class ProfileProperties {

    private List<String> devAllowedOrigins;
    private List<String> prodAllowedOrigins;



    public List<String> getDevAllowedOrigins() {
        return devAllowedOrigins;
    }

    public void setDevAllowedOrigins(List<String> devAllowedOrigins) {
        this.devAllowedOrigins = devAllowedOrigins;
    }

    public List<String> getProdAllowedOrigins() {
        return prodAllowedOrigins;
    }

    public void setProdAllowedOrigins(List<String> prodAllowedOrigins) {
        this.prodAllowedOrigins = prodAllowedOrigins;
    }

    // Define a method to get allowed origins based on the active profile
    public List<String> getAllowedOrigins(String activeProfile) {
        List<String> allowedOrigins = "dev".equals(activeProfile) ? devAllowedOrigins : prodAllowedOrigins;

        return allowedOrigins;
    }
}
