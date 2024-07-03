package com.carelyo.v1.repos.revenue;

import com.carelyo.v1.model.revenue.Revenue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RevenueRepository extends JpaRepository<Revenue, Long> {

}
