package com.carelyo.v1.model.message;

import com.carelyo.v1.model.template.ATemplate;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.templateresolver.StringTemplateResolver;

@Log4j2
public class MessageComposer {
 // Env variables
 private static final String accessKey = System.getenv("MINIO_ACCESS_NAME");
 private static final String accessSecret = System.getenv("MINIO_ACCESS_SECRET");
 private static final String minioUrl = System.getenv("MINIO_URL");
 ATemplate aTemplate;
 String htmlMessage;
 String bucketName = "html-templates";
 String mailCSSPath = "css/mail.css";
 String patientCSSPath = "css/patient.css";
 String doctorCSSPath ="css/doctor.css";

 public enum CSS {
  MAIL,
  DOCTOR_UI,
  PATIENT_UI
 }
 public MessageComposer(ATemplate aTemplate) {
  this.aTemplate = aTemplate;
  // Sets props and template if not done.
  this.aTemplate.setProps();
 }

 public String createMessage(CSS css) {
  SpringTemplateEngine templateEngine = new SpringTemplateEngine();
  StringTemplateResolver stringTemplateResolver = new StringTemplateResolver();

  templateEngine.setTemplateResolver(stringTemplateResolver);
  this.htmlMessage = templateEngine.process(String.valueOf(aTemplate.getTemplate()), getContext(css));
  return htmlMessage;
 }

 private Context getContext(CSS css) {
  Context context = new Context();
  Map<String, String> props = aTemplate.getProps();
  props.put("style_sheet", fetchCSS(css));
  props.forEach(context::setVariable);
  return context;
 }

 private String fetchCSS(CSS css) {
  String cssObject;
  if (css == CSS.MAIL) {
   cssObject = mailCSSPath;
  } else if (css == CSS.DOCTOR_UI) {
   cssObject = doctorCSSPath;
  } else if (css == CSS.PATIENT_UI) {
   cssObject = patientCSSPath;
  } else {
   return null;
  }

  MinioClient client = MinioClient.builder()
      .endpoint(minioUrl)
      .credentials(accessKey, accessSecret)
      .build();

  try {
   InputStream is = client.getObject(GetObjectArgs.builder()
       .bucket(bucketName)
       .object(cssObject)
       .build());
   String text = new BufferedReader(
       new InputStreamReader(is, StandardCharsets.UTF_8))
       .lines()
       .collect(Collectors.joining("\n"));
   is.close();
   return text;

  } catch (Exception e) {
   log.error("Could not get object: " + cssObject + " From bucket " + bucketName);
  }
  return "";
 }
}

