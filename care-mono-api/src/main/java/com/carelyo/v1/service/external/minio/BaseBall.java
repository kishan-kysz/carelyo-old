package com.carelyo.v1.service.external.minio;

import com.carelyo.v1.model.BaseModel;

public class BaseBall extends Ball {

  /**
   * Use this constructor to upload a file
   *
   * @param model instance of a model that inherits from BaseModel
   */
  public BaseBall(BaseModel model) {
    initBall(model);
  }

  /**
   * Use this constructor to remove a file
   *
   * @param filePath path to the file that should be removed.
   * @param model    instance of a model that inherits from BaseModel
   */
  public BaseBall(String filePath, BaseModel model) {
    initBall(model);
    this.filePath = filePath;
  }


}
