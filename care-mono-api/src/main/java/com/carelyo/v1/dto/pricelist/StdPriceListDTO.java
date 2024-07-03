package com.carelyo.v1.dto.pricelist;

import com.carelyo.v1.dto.ValidationMessages;
import com.carelyo.v1.model.payment.PriceList;
import java.util.HashMap;
import java.util.Map;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Value;

@Value
public class StdPriceListDTO {

  @NotBlank(message = ValidationMessages.IS_REQUIRED)
  // This name must match with priceListFromDTO.setName(name)
  // In method setEntity
  String name;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Double price;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Double vat;
  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Double commission;

  @NotNull(message = ValidationMessages.IS_REQUIRED)
  Double duration;

  // Add additional fields as needed and put it in the HasMap
  // in method prices.

  /**
   * Adds prices to the Entity as needed in this price method.
   *
   * @return HasMap of prices
   */
  private Map<String, Double> prices() {
    Map<String, Double> pricesFromDTO = new HashMap<>();
    pricesFromDTO.put("price", this.price);
    pricesFromDTO.put("vat", this.vat);
    pricesFromDTO.put("commission", this.commission);
    pricesFromDTO.put("duration", this.duration);
    return pricesFromDTO;
  }

  /**
   * Creates a PriceList object according to the DTO.
   *
   * @return PriceList Entity
   */
  public PriceList setEntity() {
    PriceList priceListFromDTO = new PriceList();
    priceListFromDTO.setName(name.toLowerCase());
    priceListFromDTO.setPrices(prices());
    return priceListFromDTO;
  }

}
