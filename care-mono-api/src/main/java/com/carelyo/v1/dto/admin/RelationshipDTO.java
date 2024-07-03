package com.carelyo.v1.dto.admin;

import java.util.Map;
import javax.validation.constraints.NotNull;
import lombok.Value;

public class RelationshipDTO {

  @Value
  public static class IllnessAndGender {

    @NotNull
    String illness;
    @NotNull
    Map<String, Long> genders;

  }

  @Value
  public static class IllnessAndAge {

    @NotNull
    String illness;
    @NotNull
    Map<String, Long> ages;

  }

  @Value
  public static class IllnessAndTime {

    @NotNull
    String illness;
    @NotNull
    Map<String, Long> times;

  }

}
