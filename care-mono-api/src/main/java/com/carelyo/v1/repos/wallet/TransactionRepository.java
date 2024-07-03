package com.carelyo.v1.repos.wallet;

import com.carelyo.v1.model.wallet.Transaction;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

  Optional<Transaction> findByReference(String reference);
}
