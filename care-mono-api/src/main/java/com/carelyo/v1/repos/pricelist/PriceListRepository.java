package com.carelyo.v1.repos.pricelist;

import com.carelyo.v1.model.payment.PriceList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PriceListRepository extends JpaRepository<PriceList, String> {

}
