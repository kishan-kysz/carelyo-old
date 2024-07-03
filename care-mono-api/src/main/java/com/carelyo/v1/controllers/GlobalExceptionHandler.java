package com.carelyo.v1.controllers;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import javax.validation.ConstraintViolationException;
import org.json.JSONObject;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<String> handleValidationErrors(MethodArgumentNotValidException ex) {
    List<JSONObject> errors = ex.getBindingResult().getFieldErrors()
        .stream()
        .map((val) -> {
          String fieldName = val.getField();
          String message = val.getDefaultMessage() == null ? "Invalid value"
              : val.getDefaultMessage();
          String formattedMessage = String.format(message, fieldName);
          JSONObject jsonObject = new JSONObject();
          jsonObject.put("field", fieldName);
          jsonObject.put("message", formattedMessage);
          jsonObject.put("code", "invalid_argument_value");
          return jsonObject;
        }).collect(Collectors.toList());
    //
    HttpHeaders httpHeaders = new HttpHeaders();
    httpHeaders.setContentType(MediaType.APPLICATION_JSON);

    return new ResponseEntity<>(getErrorsMap(errors), httpHeaders, HttpStatus.BAD_REQUEST);
  }


  @ExceptionHandler(InvalidFormatException.class)
  public final ResponseEntity<String> handleDateException(InvalidFormatException ex) {
    ex.printStackTrace();
    HttpHeaders httpHeaders = new HttpHeaders();
    httpHeaders.setContentType(MediaType.APPLICATION_JSON);
    JSONObject jsonObject = new JSONObject();
    jsonObject.put("message", ex.getMessage());
    jsonObject.put("field", "");
    jsonObject.put("code", "date_error");

    List<JSONObject> errors = Collections.singletonList(jsonObject);
    return new ResponseEntity<>(getErrorsMap(errors), httpHeaders,
        HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<String> handleValidationErrors(ConstraintViolationException ex) {
    List<JSONObject> errors = ex.getConstraintViolations()
        .stream()
        .map((constraintViolation) -> {
          String fieldName = constraintViolation.getPropertyPath().toString();
          String message = constraintViolation.getMessage();
          String formattedMessage = String.format(message, fieldName);
          JSONObject jsonObject = new JSONObject();
          jsonObject.put("field", fieldName);
          jsonObject.put("message", formattedMessage);
          jsonObject.put("code", "invalid_field_value");
          return jsonObject;
        }).collect(Collectors.toList());

    HttpHeaders httpHeaders = new HttpHeaders();
    httpHeaders.setContentType(MediaType.APPLICATION_JSON);

    return new ResponseEntity<>(getErrorsMap(errors), httpHeaders, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<String> handleBadCredentialsException(AuthenticationException ex) {
    HttpHeaders httpHeaders = new HttpHeaders();
    httpHeaders.setContentType(MediaType.APPLICATION_JSON);
    JSONObject jsonObject = new JSONObject();
    jsonObject.put("message", ex.getMessage());
    jsonObject.put("field", "email_password");
    jsonObject.put("code", "invalid_credentials");

    List<JSONObject> errors = Collections.singletonList(jsonObject);
    return new ResponseEntity<>(getErrorsMap(errors), httpHeaders, HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<String> handleResponseStatusException(ResponseStatusException ex) {
    HttpHeaders httpHeaders = new HttpHeaders();
    httpHeaders.setContentType(MediaType.APPLICATION_JSON);
    JSONObject jsonObject = new JSONObject();
    jsonObject.put("message", ex.getReason());
    jsonObject.put("field", "");
    jsonObject.put("code", "invalid_request");

    List<JSONObject> errors = Collections.singletonList(jsonObject);
    return new ResponseEntity<>(getErrorsMap(errors), httpHeaders, ex.getStatus());
  }

  @ExceptionHandler(Exception.class)
  public final ResponseEntity<String> handleGeneralExceptions(Exception ex) {

    ex.printStackTrace();
    HttpHeaders httpHeaders = new HttpHeaders();
    httpHeaders.setContentType(MediaType.APPLICATION_JSON);
    JSONObject jsonObject = new JSONObject();
    jsonObject.put("message", ex.getMessage());
    jsonObject.put("field", "");
    jsonObject.put("code", "server_error");

    List<JSONObject> errors = Collections.singletonList(jsonObject);
    return new ResponseEntity<>(getErrorsMap(errors), httpHeaders,
        HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(RuntimeException.class)
  public final ResponseEntity<String> handleRuntimeExceptions(RuntimeException ex) {
    ex.printStackTrace();
    JSONObject jsonObject = new JSONObject();
    jsonObject.put("message", ex.getMessage());
    jsonObject.put("field", "");
    jsonObject.put("code", "runtime_error");

    HttpHeaders httpHeaders = new HttpHeaders();
    httpHeaders.setContentType(MediaType.APPLICATION_JSON);
    List<JSONObject> errors = Collections.singletonList(jsonObject);
    return new ResponseEntity<>(getErrorsMap(errors), httpHeaders,
        HttpStatus.INTERNAL_SERVER_ERROR);
  }

  private String getErrorsMap(List<JSONObject> errors) {
    JSONObject errorResponse = new JSONObject();
    errorResponse.put("errors", errors);
    return errorResponse.toString();
  }


}