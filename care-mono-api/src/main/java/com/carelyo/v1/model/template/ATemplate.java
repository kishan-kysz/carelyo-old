package com.carelyo.v1.model.template;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.UploadObjectArgs;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;

@Getter
@Log4j2
public abstract class ATemplate {
  private static final String accessKey = System.getenv("MINIO_ACCESS_NAME");
  private static final String accessSecret = System.getenv("MINIO_ACCESS_SECRET");
  private static final String minioUrl = System.getenv("MINIO_URL");
  private static final String bucketName = System.getenv("TEMPLATE_BUCKET_NAME");
  private static final String rootFolder = System.getenv("TEMPLATE_ROOT_FOLDER");
  private String language = System.getenv("TEMPLATE_DEFAULT_LANGUAGE");

  String templatePath;

  public ATemplate() {
    this.templatePath = rootFolder + language + "/";
  }
  public ATemplate(String language) {
    this.language = language;
    this.templatePath = rootFolder + language + "/";
  }

  @Getter
  String template;

  @Getter
  String subject = "Carelyo notification";

  Map<String, String> props = new HashMap<>();

  boolean templateLoaded = false;

  public abstract void setProps();

  public abstract void updateTemplate();

  public void setTemplate(String template) {
    this.template = template;
  }

  public String fetchTemplate(String templateName) {
    MinioClient client = MinioClient.builder()
        .endpoint(minioUrl)
        .credentials(accessKey, accessSecret)
        .build();

    try {
      InputStream is = client.getObject(GetObjectArgs.builder()
          .bucket(bucketName)
          .object(templatePath + templateName)
          .build());
      String text = new BufferedReader(
          new InputStreamReader(is, StandardCharsets.UTF_8))
          .lines()
          .collect(Collectors.joining("\n"));
      is.close();
      template = text;
      return text;

    } catch (Exception e) {
      log.error("Could not get object: " + templateName + " From bucket " + bucketName);
    }
    return "";
  }

  public void pushTemplate(String templateName) {
    MinioClient client = MinioClient.builder()
        .endpoint(minioUrl)
        .credentials(accessKey, accessKey)
        .build();
    File file = new File(templateName);
    try (FileOutputStream iofs = new FileOutputStream(file)) {
      iofs.write(template.getBytes(StandardCharsets.UTF_8));
    } catch (Exception ignored) {

    }
    System.out.println("Trying upload file: " + templatePath + templateName );
    try {
      client.uploadObject(
          UploadObjectArgs.builder()
              .bucket(bucketName)
              .object(templatePath + templateName)
              .filename(file.getAbsolutePath())
              .build());
      log.info("Template " + templateName + " was successfully uploaded to S3 Storage");
    } catch (Exception e) {
      log.info(e.getMessage());
      log.error("Could not upload " + templateName + " to bucket " + bucketName);
    } finally {
      // if (file.delete())
        log.info("For debug purpose we did not delete the local file: \n" + file.getAbsolutePath());
    }

  }

}
