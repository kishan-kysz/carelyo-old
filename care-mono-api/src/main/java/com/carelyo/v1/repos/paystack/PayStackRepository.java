package com.carelyo.v1.repos.paystack;

import com.carelyo.v1.model.payment.PayStackData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PayStackRepository extends JpaRepository<PayStackData, String> {

}
