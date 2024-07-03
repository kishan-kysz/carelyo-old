package com.carelyo.v1.service.external.minio;

import com.carelyo.v1.dto.Base64DTO;
import com.carelyo.v1.model.BaseModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Base64Ball {

  String encodedContent = "";
  String bucketName = "";
  String destinationFolder = "";
  String objectName = "";
  String objectType = "";

  /**
   * Creates an instance and sets path and bucket name according to the BaseModel object that is passed in. Use set
   * methods to complete the build of the object.
   *
   * @param model instance of a model that inherits from BaseModel
   */
  public Base64Ball(BaseModel model) {
    initBall(model);
  }

  /**
   * Sets the bucket name after the class name of the instance. Sets the destination folder name as the id of the
   * instance. Sets the content and name accordingly to Base64DTO object. Sets the object type as of object name suffix.
   * Supported suffixes: png, jpg, jpeg, mp3, mp4
   *
   * @param model BaseModel instance to set bucket and path.
   * @param dto   Base64DTO containing content and name for the object.
   */
  public Base64Ball(BaseModel model, Base64DTO dto) {
    initBall(model);
    this.objectName = dto.getObjectName();
    this.encodedContent = dto.getEncodedContent();
    setType(dto.getObjectName());
  }

  /**
   * @param model          BaseModel instance to set bucket and path.
   * @param objectName     Name of the object (appended to the path)
   * @param encodedContent Base64 String with the content
   */
  public Base64Ball(BaseModel model, String objectName, String encodedContent) {
    initBall(model);
    this.objectName = objectName;
    this.encodedContent = encodedContent;
    setType(objectName);
  }

  /**
   * @param bucketName        Set bucket name. It will be created if not exists.
   * @param destinationFolder Set the root folder for the object
   * @param objectName        Name of the object. Appends to destination folder.
   * @param encodedContent    Base64 String with the content.
   * @param objectType        Object type like "image/png"
   */
  public Base64Ball(String bucketName, String destinationFolder, String objectName,
      String encodedContent, String objectType) {
    this.bucketName = bucketName;
    this.destinationFolder = destinationFolder;
    this.objectName = objectName;
    this.encodedContent = encodedContent;
    this.objectType = objectType;
  }


  private void initBall(BaseModel model) {
    int index = model.getClass().getName().lastIndexOf(".");
    bucketName = model.getClass().getName().substring(index + 1).toLowerCase();
    destinationFolder = model.getId().toString() + "/";
  }

  public void setType(String objectName) {

    int index = objectName.lastIndexOf(".");
    String suffix = objectName.substring(index + 1).toLowerCase();

    if (suffix.equals("mp3")) {
      this.objectType = "audio/mp3";
    }
    if (suffix.equals("mp4")) {
      this.objectType = "video/mp4";
    }
    if (suffix.equals("png")) {
      this.objectType = "image/png";
    }
    if (suffix.equals("jpg")) {
      this.objectType = "image/jpeg";
    }
    if (suffix.equals("jpeg")) {
      this.objectType = "image/jpeg";
    }
    if (suffix.equals("webp")) {
      this.objectType = "image/webp";
    }
  }

}
