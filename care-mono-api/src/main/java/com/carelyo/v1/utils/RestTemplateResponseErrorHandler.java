package com.carelyo.v1.utils;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.server.ResponseStatusException;

@Component
public class RestTemplateResponseErrorHandler
    implements ResponseErrorHandler {

  private static final Logger logger = LoggerFactory.getLogger(
      RestTemplateResponseErrorHandler.class);

  @Override
  public boolean hasError(ClientHttpResponse httpResponse)
      throws IOException {

    return (httpResponse.getStatusCode().series() == HttpStatus.Series.CLIENT_ERROR
        || httpResponse.getStatusCode().series() == HttpStatus.Series.SERVER_ERROR);
  }

  @Override
  public void handleError(ClientHttpResponse httpResponse)
      throws IOException {

    switch (httpResponse.getStatusCode()
        .series()) {
      case SERVER_ERROR:
        // handle SERVER_ERROR
        break;
      case CLIENT_ERROR:
        // handle CLIENT_ERROR
        if (!httpResponse.getStatusCode().is2xxSuccessful()) {
          logger.error("Integration Error: {}", httpResponse.getBody());
          throw new ResponseStatusException(httpResponse.getStatusCode(),
              "Integration Error, Please contact support");
        }

        break;
    }
  }
}