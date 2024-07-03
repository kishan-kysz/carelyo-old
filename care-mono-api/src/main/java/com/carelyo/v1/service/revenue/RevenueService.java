package com.carelyo.v1.service.revenue;

import com.carelyo.v1.model.revenue.Revenue;
import com.carelyo.v1.repos.revenue.RevenueRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class RevenueService {

  private final RevenueRepository revenueRepository;

  public RevenueService(RevenueRepository revenueRepository) {
    this.revenueRepository = revenueRepository;
  }

  public void addRevenue(Revenue revenue) {
    revenueRepository.save(revenue);
  }

  public List<Revenue> getAllRevenues() {
    return revenueRepository.findAll();
  }
}
