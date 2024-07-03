package com.carelyo.v1.service.security;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Creating Configuration class which return the minio client. Below code is grabs config form property file and returns
 * an instance of the minio client which we use to upload and download file using the client
 */

@Configuration
public class MinioConfig {

  @Value("${minio.access.name}")
  private String accessKey;
  @Value("${minio.access.secret}")
  private String accessSecret;
  @Value("${minio.url}")
  private String minioUrl;

  @Bean
  public MinioClient generateMinioClient() {
    return MinioClient.builder()
        .endpoint(minioUrl)
        .credentials(accessKey, accessSecret)
        .build();

  }

}