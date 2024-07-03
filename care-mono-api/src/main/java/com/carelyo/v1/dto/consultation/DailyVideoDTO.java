package com.carelyo.v1.dto.consultation;

import java.io.Serializable;
import lombok.Getter;
import lombok.Setter;
import lombok.Value;

@Getter
@Setter
public class DailyVideoDTO {

  @Value
  public static class RoomResponse implements Serializable {

    String id;

    String name;

    Boolean api_created;

    String url;

    String created_at;

    String privacy;

  }

  @Value
  public static class AccessTokenRequest {


    String room_name;
    String user_name;
    Long user_id;
    Integer eject_after_elapsed;
    Boolean is_owner;

    public AccessTokenRequest(String room_name, String user_name, Long user_id,
        Integer eject_after_elapsed,
        Boolean is_owner) {
      this.room_name = room_name;
      this.user_name = user_name;
      this.user_id = user_id;
      this.eject_after_elapsed = eject_after_elapsed;
      this.is_owner = is_owner;
    }

  }

  @Value
  public static class GetAccessTokenDTO {

    String roomName;
    Long consultationId;

    public GetAccessTokenDTO(String roomName, Long consultationId) {
      this.roomName = roomName;
      this.consultationId = consultationId;

    }

  }

}