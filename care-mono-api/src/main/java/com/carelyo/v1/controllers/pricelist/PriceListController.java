package com.carelyo.v1.controllers.pricelist;

import com.carelyo.v1.dto.pricelist.PriceResponseDTO;
import com.carelyo.v1.dto.pricelist.StdPriceListDTO;
import com.carelyo.v1.model.payment.PriceList;
import com.carelyo.v1.service.pricelist.PriceListService;
import com.carelyo.v1.service.security.services.UserDetailsImpl;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
// @CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Price list")
@PreAuthorize("hasAuthority('SYSTEMADMIN')")
@RequestMapping("/api/v1/payout")
public class PriceListController {

  private final PriceListService priceListService;

  public PriceListController(PriceListService priceListService) {
    this.priceListService = priceListService;
  }

  @Operation(summary = "Add a new PriceList.", description = "**Role** 'SYSTEMADMIN'")
  @PostMapping("/price-list")
  public ResponseEntity<PriceList> createPriceList(@Valid @RequestBody StdPriceListDTO dto) {
    return ResponseEntity.ok(priceListService.createPriceList(dto));
  }

  @Operation(summary = "Updates an existing PriceList.", description = "**Role** 'SYSTEMADMIN'")
  @PutMapping("/price-list")
  public ResponseEntity<PriceList> updatePriceList(@Valid @RequestBody StdPriceListDTO dto,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    if (userDetails.getId() != 1) {
      if (dto.getCommission() != null || dto.getVat() != null) {
        throw new RuntimeException("You are not allowed to change the commission or vat");
      }
    }
    return ResponseEntity.ok(priceListService.updatePriceList(dto));
  }

  @Operation(summary = "Get a PriceList.", description = "**Role** 'SYSTEMADMIN'")
  @GetMapping("/price-list")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('SYSTEMADMIN') or hasAuthority('DOCTOR')")
  public ResponseEntity<PriceList> getPriceList(String name) {
    return ResponseEntity.ok(priceListService.getPriceListById(name));
  }

  @Operation(summary = "Get a Price from a price list.", description = "**Role** 'PATIENT, SYSTEMADMIN'")
  @GetMapping("/price")
  @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('SYSTEMADMIN')")
  public ResponseEntity<PriceResponseDTO> getPrice(String priceListName) {
    PriceList priceList = priceListService.getPriceListById(priceListName);
    PriceResponseDTO response = new PriceResponseDTO(priceList.getPrices().get("price"),
        priceList.getPrices().get("duration"));
    return ResponseEntity.ok(response);
  }

  @Operation(summary = "Gets all the PriceLists in an array.", description = "**Role** 'SYSTEMADMIN'")
  @GetMapping("/price-lists")
  public ResponseEntity<List<PriceList>> getAllPriceLists() {
    return ResponseEntity.ok(priceListService.getAllPriceLists());
  }

  @Operation(summary = "Deletes a price list.", description = "**Role** 'SYSTEMADMIN'")
  @DeleteMapping("/price-list")
  public ResponseEntity<Boolean> deletePriceList(String name) {
    return ResponseEntity.ok(priceListService.deletePriceList(name));
  }
}
