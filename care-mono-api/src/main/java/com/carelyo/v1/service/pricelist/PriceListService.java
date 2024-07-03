package com.carelyo.v1.service.pricelist;

import com.carelyo.v1.dto.pricelist.StdPriceListDTO;
import com.carelyo.v1.model.payment.PriceList;
import com.carelyo.v1.repos.pricelist.PriceListRepository;
import com.carelyo.v1.service.pricelist.exceptions.PriceException;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PriceListService {

  private final PriceListRepository priceListRepository;

  public PriceListService(PriceListRepository priceListRepository) {
    this.priceListRepository = priceListRepository;
  }

  public PriceList createPriceList(StdPriceListDTO dto) {
    Optional<PriceList> optionalPriceList = priceListRepository.findById(dto.getName());
    if (optionalPriceList.isPresent()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Price list already exists");
    }
    return priceListRepository.save(dto.setEntity());
  }

  public PriceList updatePriceList(StdPriceListDTO dto) {
    getPriceListById(dto.getName());
    return priceListRepository.save(dto.setEntity());
  }

  public PriceList getPriceListById(String name) {

    Optional<PriceList> priceList = priceListRepository.findById(name.toLowerCase());

    if (priceList.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Price list not found");
    }
    return priceList.get();
  }

  public boolean priceListExistsById(String name) {
    return priceListRepository.findById(name.toLowerCase()).isPresent();
  }

  public Double getPriceById(String priceListName) {
    PriceList priceList = getPriceListById(priceListName);
    return priceList.getPrices().get("price");
  }

  public Double getCommissionById(String priceListName) {
    PriceList priceList = getPriceListById(priceListName);
    return priceList.getPrices().get("price") * priceList.getPrices().get("commission");
  }

  public Double getVatById(String priceListName) {
    PriceList priceList = getPriceListById(priceListName);
    return priceList.getPrices().get("price") * priceList.getPrices().get("vat");
  }

  public Double getToBePaidOut(String priceListName) {
    return getPriceById(priceListName.toLowerCase()) - getCommissionById(priceListName)
        - getVatById(priceListName);
  }

  public List<PriceList> getAllPriceLists() {
    return priceListRepository.findAll();
  }

  public boolean deletePriceList(String name) {
    if (priceListRepository.findById(name.toLowerCase()).isEmpty()) {
      throw new PriceException("Price list not found");
    }
    priceListRepository.deleteById(name.toLowerCase());
    return !priceListRepository.existsById(name.toLowerCase());
  }
}
