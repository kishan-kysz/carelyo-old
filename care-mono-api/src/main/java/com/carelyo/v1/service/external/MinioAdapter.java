package com.carelyo.v1.service.external;

import com.carelyo.v1.model.BaseModel;
import com.carelyo.v1.service.external.minio.Ball;
import com.carelyo.v1.service.external.minio.Base64Ball;
import io.minio.BucketExistsArgs;
import io.minio.GetObjectArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.ListObjectsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.Result;
import io.minio.UploadObjectArgs;
import io.minio.errors.ErrorResponseException;
import io.minio.errors.InsufficientDataException;
import io.minio.errors.InternalException;
import io.minio.errors.InvalidResponseException;
import io.minio.errors.MinioException;
import io.minio.errors.ServerException;
import io.minio.errors.XmlParserException;
import io.minio.http.Method;
import io.minio.messages.Item;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.StreamSupport;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;


/**
 * The Adaptor Service class which implements file upload and download logic.
 */
@Service
@Slf4j
public class MinioAdapter {

  @Autowired
  private final MinioClient minioClient;

  @Value("${minio.bucket.name}")
  String defaultBucketName;

  @Value("${minio.default.folder}")
  String defaultBaseFolder;

  public MinioAdapter(MinioClient minioClient) {
    this.minioClient = minioClient;
  }

  public void uploadFile(String name, byte[] content) throws SecurityException {
    File file = new File(name);
    try (FileOutputStream iofs = new FileOutputStream(file)) {
      iofs.write(content);
      minioClient.uploadObject(
          UploadObjectArgs.builder()
              .bucket(defaultBucketName)
              .object(defaultBaseFolder + name)
              .filename(file.getAbsolutePath())
              .build());

    } catch (MinioException e) {
      log.error("Error occurred: " + e);
    } catch (IOException | NoSuchAlgorithmException | InvalidKeyException e) {
      log.error("Error occurred: " + e);
      throw new RuntimeException(e);
    }
  }

  public void uploadFile(String name, byte[] content, String bucketName) throws SecurityException {
    File file = new File(name);
    try (FileOutputStream iofs = new FileOutputStream(file)) {
      iofs.write(content);
      minioClient.uploadObject(
          UploadObjectArgs.builder()
              .bucket(bucketName)
              .object(defaultBaseFolder + name)
              .filename(file.getAbsolutePath())
              .build());

    } catch (MinioException e) {
      log.error("Error occurred: " + e);
    } catch (IOException | NoSuchAlgorithmException | InvalidKeyException e) {
      log.error("Error occurred: " + e);
      throw new RuntimeException(e);
    }
  }

  public String getSignedUrl(String name)
      throws IOException, ServerException, InsufficientDataException, ErrorResponseException,
      NoSuchAlgorithmException, InvalidKeyException, XmlParserException, InternalException,
      InvalidResponseException {
    return minioClient.getPresignedObjectUrl(
        GetPresignedObjectUrlArgs.builder()
            .method(Method.GET)
            .bucket(defaultBucketName)
            .object(name)
            .expiry(24 * 60 * 60 * 7, TimeUnit.SECONDS)
            .build());
  }

  public void removeFile(String name) {
    try {
      minioClient.removeObject(
          RemoveObjectArgs.builder().bucket(defaultBucketName).object(name).build());
    } catch (Exception e) {
      throw new RuntimeException(e.getMessage());
    }
  }

  public String getSignedUrl(String name, String bucketName)
      throws IOException, ServerException, InsufficientDataException, ErrorResponseException,
      NoSuchAlgorithmException, InvalidKeyException, XmlParserException, InternalException,
      InvalidResponseException {
    return minioClient.getPresignedObjectUrl(
        GetPresignedObjectUrlArgs.builder()
            .method(Method.GET)
            .bucket(bucketName)
            .object(name)
            .expiry(24 * 60 * 60 * 7, TimeUnit.SECONDS)
            .build());
  }

  public int fileCounter(BaseModel instance) {
    int index = instance.getClass().getName().lastIndexOf(".");
    String bucketName = instance.getClass().getName().substring(index + 1).toLowerCase();

    String prefix = instance.getId().toString() + "/";

    // Make sure bucket exists.
    prepareBucket(bucketName);

    Iterable<Result<Item>> results = minioClient.listObjects(ListObjectsArgs.builder()
        .bucket(bucketName)
        .prefix(prefix)
        .build());
    return (int) StreamSupport.stream(results.spliterator(), false).count();
  }

  public String getHtml(String bucketName, String objectName) {
    try {
      InputStream is = minioClient.getObject(GetObjectArgs.builder()
          .bucket(bucketName)
          .object(objectName)
          .build());
      return Arrays.toString(is.readAllBytes());

    } catch (Exception e) {
      log.error("Could not get object: " + objectName + " From bucket " + bucketName);
    }
    return null;
  }

  // Returns a file from an Url to a file path.
  public void downloadBucket(String bucketName, String path)
      throws ServerException, InsufficientDataException, ErrorResponseException, IOException,
      NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException,
      InternalException {

    Iterable<Result<Item>> items = getObjects(bucketName);

    for (Result<Item> item : items) {

      InputStream is = minioClient.getObject(GetObjectArgs.builder()
          .bucket(bucketName)
          .object(item.get().objectName())
          .build());
      String filePath = path + "/" + item.get().objectName();

      ClassPathResource resource = new ClassPathResource(filePath);
      File file = new File(resource.getFile().getPath());
      try (FileOutputStream iofs = new FileOutputStream(resource.getFile())) {
        iofs.write(is.readAllBytes());
      }
    }
  }


  // Gets a list of urls to files in a bucket.
  private Iterable<Result<Item>> getObjects(String bucketName) {
    
    String prefix = "/";

    // Make sure bucket exists.
    prepareBucket(bucketName);

    Iterable<Result<Item>> results = minioClient.listObjects(ListObjectsArgs.builder()
        .bucket(bucketName)
        .prefix(prefix)
        .build());

    return results;

  }

  /**
   * Produces a list of signed urls of all the files that belongs to an instance
   *
   * @param instance An instance of the class that owns the bucket.
   * @return A list of Signed urls.
   */
  public List<String> getFilesURLs(BaseModel instance)
      throws ServerException, InsufficientDataException, ErrorResponseException, IOException,
      NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException,
      XmlParserException, InternalException {

    List<String> fileURLs = new ArrayList<>();

    int index = instance.getClass().getName().lastIndexOf(".");
    String bucketName = instance.getClass().getName().substring(index + 1).toLowerCase();

    String prefix = instance.getId().toString() + "/";

    // Make sure bucket exists.
    prepareBucket(bucketName);

    Iterable<Result<Item>> results = minioClient.listObjects(ListObjectsArgs.builder()
        .bucket(bucketName)
        .prefix(prefix)
        .build());

    for (Result<Item> item : results) {
      fileURLs.add(getSignedUrl(item.get().objectName(), bucketName));

    }

    return fileURLs;

  }

  // Throwing balls section.
  // Instance of type Ball is for Form data multipartFile
  // Instance of type Base64Ball is for Base64 encoded Strings.

  // Gets the signed url of the file inside the Ball
  public String getSignedUrl(Ball ball)
      throws ServerException, InsufficientDataException, ErrorResponseException,
      IOException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException,
      XmlParserException, InternalException {

    return minioClient.getPresignedObjectUrl(
        GetPresignedObjectUrlArgs.builder()
            .method(Method.GET)
            .bucket(ball.getBucketName())
            .object(ball.getPath() + ball.getFileName())
            .build());


  }

  public void removeBallFromBucket(Ball ball) {

    // prepare bucket
    prepareBucket(ball.getBucketName());

    try {
      minioClient.removeObject(
          RemoveObjectArgs.builder().bucket(ball.getBucketName())
              .object(ball.getFilePath()).build());
    } catch (Exception e) {
      throw new RuntimeException(e.getMessage());
    }
  }

  // Saves a file to minIO as described in a Ball object.
  public String addBallToBucket(Ball ball)
      throws ServerException, InsufficientDataException, ErrorResponseException,
      IOException, NoSuchAlgorithmException, InvalidKeyException, XmlParserException,
      InvalidResponseException, InternalException {

    // Prepare bucket
    boolean ok = prepareBucket(ball.getBucketName());
    if (!ok) {
      return "ERROR: creating / finding bucket";
    }

    // Upload content
    File file = new File(ball.getFileName());

    try (FileOutputStream iofs = new FileOutputStream(file)) {
      iofs.write(ball.getFileContent());

      minioClient.uploadObject(
          UploadObjectArgs.builder()
              .bucket(ball.getBucketName())
              .object(ball.getPath() + ball.getFileName())
              .filename(file.getAbsolutePath())
              .build());


    } catch (MinioException e) {
      log.debug("Failed to add ball to bucket");
    } catch (IOException | NoSuchAlgorithmException | InvalidKeyException e) {
      throw new RuntimeException(e);
    }

    // remove local file
    if (file.delete()) {
      log.debug("File " + ball.getFileName() + " deleted from local storage");
    }
    // Return Signed url
    return getSignedUrl(ball);
  }


  // Checks if a bucket exist, if not it creates a bucket
  private Boolean prepareBucket(String bucketName) {
    try {
      boolean found =
          minioClient.bucketExists(
              BucketExistsArgs.builder().bucket(bucketName).build());
      if (!found) {
        minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());}
      return true;
    } catch (Exception e) {
      log.error(e.getMessage());
    }

    return false;
  }

  // ************************ BASE64 SECTION ************************************

  public void uploadObject(Base64Ball ball)
      throws ServerException, InsufficientDataException, ErrorResponseException,
      IOException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException,
      XmlParserException, InternalException {

    // Make sure bucket exists
    prepareBucket(ball.getBucketName());

    // Decode Base64 and set stream.
    byte[] tmp = Base64.getDecoder().decode(ball.getEncodedContent());
    InputStream buffer = new ByteArrayInputStream(tmp);
    int size = buffer.available();

    // Send stream to S3 storage
    minioClient.putObject(PutObjectArgs.builder()
        .bucket(ball.getBucketName())
        .object(ball.getDestinationFolder() + ball.getObjectName())
        .contentType(ball.getObjectType())
        .stream(buffer, size, -1)
        .build());
  }
}
