package com.carelyo.v1.service.external.minio;

import com.carelyo.v1.model.BaseModel;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Ball {

  String bucketName;
  String path;
  String fileName;
  byte[] fileContent;
  String filePath;

  public Ball() {

  }

  /**
   * Sets path and bucket name to fit the instance.
   *
   * @param model instance of a model that inherits from BaseModel
   */
  void initBall(BaseModel model) {
    int index = model.getClass().getName().lastIndexOf(".");
    bucketName = model.getClass().getName().substring(index + 1).toLowerCase();

    path = model.getId().toString() + "/";
  }
}
