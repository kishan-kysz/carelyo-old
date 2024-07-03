package com.carelyo.v1.repos.wallet;

import com.carelyo.v1.model.wallet.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {

  Wallet findByUserId(Long userId);
}
