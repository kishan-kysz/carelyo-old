package com.carelyo.v1.utils;


import com.carelyo.v1.model.BaseModel;
import java.util.List;

public class ModelSorter<T extends BaseModel> {

  private final List<T> data;

  public ModelSorter(List<T> data) {
    this.data = data;
  }

  public List<T> sortModelByTimeCreated() {
    data.sort(BaseModel.timeCreatedComparator);
    return data;
  }

  public List<T> sortModelByTimeUpdated() {
    data.sort(BaseModel.timeUpdatedComparator);
    return data;
  }
}

